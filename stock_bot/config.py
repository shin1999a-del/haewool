"""
config.py — ボット設定
.env ファイルまたは環境変数から読み込む
"""
import os
from dotenv import load_dotenv

load_dotenv()  # .env ファイルを自動読み込み

# ────────────────────────────
# Alpaca API 認証
# ────────────────────────────
ALPACA_API_KEY    = os.getenv("ALPACA_API_KEY", "")
ALPACA_SECRET_KEY = os.getenv("ALPACA_SECRET_KEY", "")
PAPER_TRADING     = os.getenv("ALPACA_PAPER", "true").lower() == "true"  # True=紙トレード

# ────────────────────────────
# 対象ETFリスト
# ────────────────────────────
ETF_UNIVERSE = [
    "SPY",   # S&P 500
    "QQQ",   # NASDAQ 100
    "VOO",   # Vanguard S&P 500
    "VTI",   # 米国全株式
    "VGT",   # ITセクター
    "SOXX",  # 半導体
    "XLK",   # テクノロジーセクター
    "XLF",   # 金融セクター
    "GLD",   # 金
    "TLT",   # 長期国債
    "ARKK",  # ARKイノベーション
]

# ────────────────────────────
# リスク管理パラメータ
# ────────────────────────────
MAX_POSITIONS      = 5      # 最大同時保有ポジション数
MAX_POSITION_PCT   = 0.20   # 1ポジションあたり最大ポートフォリオ比率 (20%)
MIN_BUY_SCORE      = 65.0   # BUYと判定するための最低スコア (0〜100)
SELL_SCORE_THRESH  = 40.0   # これ以下なら売却
STOP_LOSS_PCT      = 0.07   # ストップロス: エントリーから -7%
TAKE_PROFIT_PCT    = 0.20   # 利確: エントリーから +20% (0=無効)

# ────────────────────────────
# 実行スケジュール
# ────────────────────────────
# US市場の取引時間: 東部時間 9:30〜16:00
# 日本時間(夏): 22:30〜翌5:00 / 日本時間(冬): 23:30〜翌6:00
RUN_HOUR_ET   = 9    # 実行時刻 (東部時間)
RUN_MINUTE_ET = 35   # 市場オープン直後

# ────────────────────────────
# ログ
# ────────────────────────────
LOG_FILE = "bot.log"
LOG_LEVEL = "INFO"
