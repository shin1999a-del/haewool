"""
bot.py — ETF自動売買ボット メインロジック

使い方:
  python bot.py          # 1回実行
  python bot.py --watch  # 毎日自動実行（市場オープン後）
"""
import os
import sys
import time
import logging
import argparse
from datetime import datetime, timezone
import pytz

from config import (
    ALPACA_API_KEY, ALPACA_SECRET_KEY, PAPER_TRADING,
    ETF_UNIVERSE,
    MAX_POSITIONS, MAX_POSITION_PCT,
    MIN_BUY_SCORE, SELL_SCORE_THRESH,
    STOP_LOSS_PCT, TAKE_PROFIT_PCT,
    LOG_FILE, LOG_LEVEL,
    RUN_HOUR_ET, RUN_MINUTE_ET,
)
from analysis import scan_etfs, score_symbol

# ────────────────────────────
# ロギング設定
# ────────────────────────────
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)


# ────────────────────────────
# Alpaca クライアント初期化
# ────────────────────────────
def get_client():
    try:
        from alpaca.trading.client import TradingClient
        client = TradingClient(ALPACA_API_KEY, ALPACA_SECRET_KEY, paper=PAPER_TRADING)
        return client
    except ImportError:
        logger.error("alpaca-py がインストールされていません: pip install alpaca-py")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Alpaca接続失敗: {e}")
        sys.exit(1)


# ────────────────────────────
# 市場オープン確認
# ────────────────────────────
def is_market_open(client) -> bool:
    try:
        clock = client.get_clock()
        return clock.is_open
    except Exception as e:
        logger.warning(f"市場状態確認失敗: {e}")
        return False


# ────────────────────────────
# ポートフォリオ表示
# ────────────────────────────
def print_portfolio(client):
    try:
        account   = client.get_account()
        positions = client.get_all_positions()
        pv   = float(account.portfolio_value)
        cash = float(account.cash)
        logger.info("=" * 55)
        logger.info(f"📊 ポートフォリオ: ${pv:>12,.2f}  現金: ${cash:>10,.2f}")
        if positions:
            logger.info("  保有ポジション:")
            for p in positions:
                pl    = float(p.unrealized_pl)
                pl_pc = float(p.unrealized_plpc) * 100
                icon  = "📈" if pl >= 0 else "📉"
                logger.info(
                    f"  {icon} {p.symbol:<6} {float(p.qty):>6.2f}株  "
                    f"avg ${float(p.avg_entry_price):.2f}  "
                    f"PnL: ${pl:+.2f} ({pl_pc:+.1f}%)"
                )
        else:
            logger.info("  保有ポジション: なし")
        logger.info("=" * 55)
        return float(account.portfolio_value), float(account.buying_power)
    except Exception as e:
        logger.error(f"ポートフォリオ取得失敗: {e}")
        return 0.0, 0.0


# ────────────────────────────
# 注文送信ヘルパー
# ────────────────────────────
def place_order(client, symbol: str, qty: float, side: str):
    from alpaca.trading.requests import MarketOrderRequest
    from alpaca.trading.enums import OrderSide, TimeInForce
    try:
        req = MarketOrderRequest(
            symbol=symbol,
            qty=qty,
            side=OrderSide.BUY if side == "BUY" else OrderSide.SELL,
            time_in_force=TimeInForce.DAY,
        )
        order = client.submit_order(req)
        logger.info(f"✅ 注文送信: {side} {symbol} x{qty}株 (ID: {order.id})")
        return order
    except Exception as e:
        logger.error(f"❌ 注文失敗 {side} {symbol}: {e}")
        return None


# ────────────────────────────
# メイン売買ロジック
# ────────────────────────────
def run_once(client):
    logger.info("━" * 55)
    logger.info(f"🤖 ETF自動売買ボット 開始: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    mode = "📄 紙トレード" if PAPER_TRADING else "💰 リアルマネー"
    logger.info(f"   モード: {mode}")

    # ── ポートフォリオ確認 ──
    portfolio_value, buying_power = print_portfolio(client)
    if portfolio_value == 0:
        logger.error("アカウント情報取得失敗。終了します。")
        return

    # ── 全ETFを分析 ──
    logger.info(f"\n📡 {len(ETF_UNIVERSE)}銘柄のETFを分析中...")
    results = scan_etfs(ETF_UNIVERSE)

    logger.info("\n📋 分析結果 (スコア順):")
    logger.info(f"  {'銘柄':<6} {'シグナル':<6} {'スコア':>6} {'信頼度':>6} {'RSI':>6} {'価格':>8}")
    logger.info("  " + "-" * 46)
    for r in results:
        icon = "🟢" if r['signal'] == "BUY" else ("🔴" if r['signal'] == "SELL" else "⚪")
        logger.info(
            f"  {icon}{r['symbol']:<5} {r['signal']:<6} {r['score']:>5.1f} "
            f"{r['confidence']:>5}%  {r['rsi'] or '-':>5}  ${r['price']:>7.2f}"
        )

    # ── 現在のポジション取得 ──
    positions = {p.symbol: p for p in client.get_all_positions()}
    n_positions = len(positions)

    # ══════════════════════════════
    # SELL ロジック
    # ══════════════════════════════
    logger.info("\n🔴 売却チェック...")
    sold_any = False
    result_map = {r['symbol']: r for r in results}

    for symbol, pos in positions.items():
        r = result_map.get(symbol)
        entry_price   = float(pos.avg_entry_price)
        current_price = r['price'] if r else entry_price
        pnl_pct       = (current_price - entry_price) / entry_price * 100 if entry_price > 0 else 0
        qty           = float(pos.qty)

        reason = None

        # ストップロス
        if pnl_pct <= -(STOP_LOSS_PCT * 100):
            reason = f"ストップロス ({pnl_pct:.1f}%)"

        # 利確
        elif TAKE_PROFIT_PCT > 0 and pnl_pct >= TAKE_PROFIT_PCT * 100:
            reason = f"利確 (+{pnl_pct:.1f}%)"

        # SELL シグナル
        elif r and r['score'] <= SELL_SCORE_THRESH:
            reason = f"SELLシグナル (スコア {r['score']:.1f})"

        if reason:
            logger.info(f"  → {symbol} 売却: {reason}")
            place_order(client, symbol, qty, "SELL")
            sold_any = True
            n_positions -= 1

    if not sold_any:
        logger.info("  → 売却対象なし")

    # ポジション数再取得（売却後）
    time.sleep(2)
    positions = {p.symbol: p for p in client.get_all_positions()}
    n_positions = len(positions)
    buying_power = float(client.get_account().buying_power)

    # ══════════════════════════════
    # BUY ロジック
    # ══════════════════════════════
    logger.info("\n🟢 購入チェック...")
    available_slots = MAX_POSITIONS - n_positions

    if available_slots <= 0:
        logger.info(f"  → ポジション上限 ({MAX_POSITIONS}個) に達しています")
    else:
        buy_candidates = [
            r for r in results
            if r['signal'] == 'BUY'
            and r['score'] >= MIN_BUY_SCORE
            and r['symbol'] not in positions
        ]

        if not buy_candidates:
            logger.info("  → BUYシグナルのある銘柄なし")
        else:
            for r in buy_candidates[:available_slots]:
                symbol = r['symbol']

                # ポジションサイズ計算
                max_value  = portfolio_value * MAX_POSITION_PCT
                invest_val = min(max_value, buying_power * 0.95)  # 余裕を持たせる
                qty        = int(invest_val / r['price'])

                if qty < 1:
                    logger.info(f"  → {symbol}: 資金不足 (必要: ${r['price']:.2f})")
                    continue

                actual_cost = qty * r['price']
                if actual_cost > buying_power:
                    logger.info(f"  → {symbol}: 資金不足 (必要: ${actual_cost:.0f}, 残: ${buying_power:.0f})")
                    continue

                logger.info(
                    f"  → {symbol} 購入: {qty}株 @ ${r['price']:.2f} "
                    f"(${actual_cost:,.0f}) | スコア {r['score']:.1f}"
                )
                order = place_order(client, symbol, qty, "BUY")
                if order:
                    buying_power -= actual_cost
                    n_positions  += 1

    # ── 終了後のポートフォリオ表示 ──
    time.sleep(3)
    logger.info("\n📊 実行後のポートフォリオ:")
    print_portfolio(client)
    logger.info("🏁 ボット実行完了\n")


# ────────────────────────────
# ウォッチモード（毎日自動実行）
# ────────────────────────────
def run_watch(client):
    ET = pytz.timezone("America/New_York")
    logger.info("👁️  ウォッチモード開始 (Ctrl+C で停止)")
    logger.info(f"   毎営業日 {RUN_HOUR_ET:02d}:{RUN_MINUTE_ET:02d} ET に実行します")

    while True:
        now_et = datetime.now(ET)
        target = now_et.replace(hour=RUN_HOUR_ET, minute=RUN_MINUTE_ET, second=0, microsecond=0)

        if now_et >= target:
            # 今日は既に実行時刻を過ぎているので翌日
            from datetime import timedelta
            target += timedelta(days=1)

        wait_sec = (target - now_et).total_seconds()
        logger.info(f"   次の実行まで: {int(wait_sec//3600)}h {int((wait_sec%3600)//60)}m")
        time.sleep(min(wait_sec, 300))  # 最大5分ごとにチェック

        now_et = datetime.now(ET)
        if now_et >= target:
            if is_market_open(client):
                run_once(client)
            else:
                logger.info("   市場が開いていないためスキップ")


# ────────────────────────────
# エントリーポイント
# ────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ETF AI自動売買ボット")
    parser.add_argument("--watch",  action="store_true", help="毎日自動実行モード")
    parser.add_argument("--scan",   action="store_true", help="売買せず分析だけ実行")
    args = parser.parse_args()

    if not ALPACA_API_KEY or not ALPACA_SECRET_KEY:
        print("\n❌ APIキーが設定されていません。")
        print("   .env ファイルを作成して ALPACA_API_KEY と ALPACA_SECRET_KEY を設定してください。")
        print("   → .env.example を参考にしてください\n")
        sys.exit(1)

    client = get_client()

    if args.scan:
        # 分析のみ（売買しない）
        logger.info("🔍 スキャンモード（売買なし）")
        results = scan_etfs(ETF_UNIVERSE)
        print(f"\n{'銘柄':<6} {'シグナル':<6} {'スコア':>6} {'信頼度':>6} {'RSI':>6} {'現在値':>8}")
        print("-" * 45)
        for r in results:
            print(f"{r['symbol']:<6} {r['signal']:<6} {r['score']:>6.1f} {r['confidence']:>5}%  {r['rsi'] or '-':>5}  ${r['price']:>7.2f}")
    elif args.watch:
        run_watch(client)
    else:
        run_once(client)
