"""
analysis.py — ETFテクニカル分析エンジン
SMA / EMA / RSI / MACD / ボリンジャーバンド / 出来高 / モメンタムを計算し
BUY / HOLD / SELL シグナルとスコア(0〜100)を返す
"""
import numpy as np
import pandas as pd
import yfinance as yf
import logging

logger = logging.getLogger(__name__)


# ───────────────────────────────────────────
# テクニカル指標計算
# ───────────────────────────────────────────

def calc_sma(prices: np.ndarray, period: int) -> np.ndarray:
    return pd.Series(prices).rolling(window=period, min_periods=period).mean().values

def calc_ema(prices: np.ndarray, period: int) -> np.ndarray:
    return pd.Series(prices).ewm(span=period, adjust=False).mean().values

def calc_rsi(prices: np.ndarray, period: int = 14) -> np.ndarray:
    s = pd.Series(prices)
    delta = s.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    avg_gain = gain.rolling(window=period, min_periods=period).mean()
    avg_loss = loss.rolling(window=period, min_periods=period).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    return (100 - 100 / (1 + rs)).values

def calc_macd(prices: np.ndarray, fast=12, slow=26, signal=9):
    s = pd.Series(prices)
    ema_f = s.ewm(span=fast, adjust=False).mean()
    ema_s = s.ewm(span=slow, adjust=False).mean()
    macd_line  = ema_f - ema_s
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram  = macd_line - signal_line
    return macd_line.values, signal_line.values, histogram.values

def calc_bb(prices: np.ndarray, period=20, mult=2.0):
    s = pd.Series(prices)
    sma   = s.rolling(window=period, min_periods=period).mean()
    std   = s.rolling(window=period, min_periods=period).std()
    upper = sma + mult * std
    lower = sma - mult * std
    return upper.values, sma.values, lower.values


# ───────────────────────────────────────────
# データ取得
# ───────────────────────────────────────────

def fetch_ohlcv(symbol: str, period: str = '5y', interval: str = '1d') -> pd.DataFrame | None:
    """Yahoo Finance から OHLCV を取得する"""
    try:
        df = yf.download(symbol, period=period, interval=interval,
                         auto_adjust=True, progress=False)
        if df is None or len(df) < 60:
            logger.warning(f"{symbol}: データ不足 ({len(df) if df is not None else 0}行)")
            return None
        return df
    except Exception as e:
        logger.error(f"{symbol} データ取得失敗: {e}")
        return None


# ───────────────────────────────────────────
# スコアリング & シグナル生成
# ───────────────────────────────────────────

def score_symbol(symbol: str) -> dict | None:
    """
    テクニカル分析を実行し、以下を返す:
    {
        symbol, price, score (0-100), signal ('BUY'/'HOLD'/'SELL'),
        confidence (%), signals (詳細辞書), rsi, sma20, sma50, sma200
    }
    """
    df = fetch_ohlcv(symbol)
    if df is None:
        return None

    closes  = df['Close'].values.flatten().astype(float)
    volumes = df['Volume'].values.flatten().astype(float)
    n       = len(closes)
    last    = n - 1
    price   = closes[last]

    sma20  = calc_sma(closes, 20)
    sma50  = calc_sma(closes, 50)
    sma200 = calc_sma(closes, 200) if n >= 200 else None
    rsi14  = calc_rsi(closes, 14)
    macd_l, macd_s, macd_h = calc_macd(closes)
    bb_u, bb_m, bb_l = calc_bb(closes, 20)

    raw_score = 0.0
    signals   = {}

    def _v(arr, idx):
        """配列の値がNaN/Noneでなければ返す"""
        if arr is None: return None
        v = arr[idx]
        return None if np.isnan(v) else v

    # ── SMA 20 ──
    v = _v(sma20, last)
    if v is not None:
        if price > v:  raw_score += 1.5; signals['SMA20'] = f'強気 (価格 > ${v:.2f})'
        else:          raw_score -= 1.5; signals['SMA20'] = f'弱気 (価格 < ${v:.2f})'

    # ── SMA 50 ──
    v = _v(sma50, last)
    if v is not None:
        if price > v:  raw_score += 1.5; signals['SMA50'] = f'強気 (価格 > ${v:.2f})'
        else:          raw_score -= 1.5; signals['SMA50'] = f'弱気 (価格 < ${v:.2f})'

    # ── SMA 200 ──
    v = _v(sma200, last) if sma200 is not None else None
    if v is not None:
        if price > v:  raw_score += 2.0; signals['SMA200'] = f'長期強気 (価格 > ${v:.2f})'
        else:          raw_score -= 2.0; signals['SMA200'] = f'長期弱気 (価格 < ${v:.2f})'

    # ── ゴールデン/デスクロス ──
    v20, v50 = _v(sma20, last), _v(sma50, last)
    if v20 and v50:
        if v20 > v50: raw_score += 1.0; signals['クロス'] = 'ゴールデンクロス (SMA20>SMA50)'
        else:         raw_score -= 1.0; signals['クロス'] = 'デスクロス (SMA20<SMA50)'

    # ── RSI ──
    rv = _v(rsi14, last)
    if rv is not None:
        if   rv < 30:  raw_score += 2.5; signals['RSI'] = f'売られすぎ ({rv:.1f}) — 反発期待'
        elif rv < 40:  raw_score += 1.0; signals['RSI'] = f'弱気だが反発余地 ({rv:.1f})'
        elif rv > 80:  raw_score -= 3.0; signals['RSI'] = f'極度の買われすぎ ({rv:.1f})'
        elif rv > 70:  raw_score -= 2.0; signals['RSI'] = f'買われすぎ ({rv:.1f})'
        elif rv >= 55: raw_score += 1.0; signals['RSI'] = f'強気ゾーン ({rv:.1f})'
        else:                            signals['RSI'] = f'中立 ({rv:.1f})'

    # ── MACD ──
    mv  = _v(macd_l, last)
    msv = _v(macd_s, last)
    mhv = _v(macd_h, last)
    if mv is not None and msv is not None:
        if mv > msv: raw_score += 1.5; signals['MACD'] = f'強気 ({mv:.3f} > {msv:.3f})'
        else:        raw_score -= 1.5; signals['MACD'] = f'弱気 ({mv:.3f} < {msv:.3f})'
        if mhv is not None and last > 0:
            ph = _v(macd_h, last - 1)
            if ph is not None:
                if mhv > ph and mhv > 0: raw_score += 0.5; signals['MACDトレンド'] = '上昇加速中'
                elif mhv < ph and mhv < 0: raw_score -= 0.5; signals['MACDトレンド'] = '下降加速中'

    # ── ボリンジャーバンド ──
    bu, bl = _v(bb_u, last), _v(bb_l, last)
    if bu is not None and bl is not None:
        rng = bu - bl
        if rng > 0:
            pos = (price - bl) / rng
            if   pos > 1.05:  raw_score -= 2.0; signals['BB'] = f'バンド上抜け ({pos:.2f}) — 過熱'
            elif pos < -0.05: raw_score += 2.0; signals['BB'] = f'バンド下抜け ({pos:.2f}) — 売られすぎ'
            elif pos >= 0.8:  raw_score += 0.5; signals['BB'] = f'バンド上部 ({pos:.0%})'
            elif pos <= 0.2:  raw_score -= 0.5; signals['BB'] = f'バンド下部 ({pos:.0%})'

    # ── 出来高 ──
    if len(volumes) >= 10:
        rv5 = float(np.mean(volumes[-5:]))
        pv5 = float(np.mean(volumes[-10:-5]))
        if pv5 > 0:
            if   rv5 > pv5 * 1.2: raw_score += 0.8; signals['出来高'] = f'急増 ({rv5/1e6:.1f}M vs {pv5/1e6:.1f}M)'
            elif rv5 < pv5 * 0.8: raw_score -= 0.5; signals['出来高'] = '急減'

    # ── 5日モメンタム ──
    if n > 5:
        mom = (closes[last] - closes[last - 5]) / closes[last - 5] * 100
        if   mom >  5: raw_score += 1.0; signals['モメンタム'] = f'+{mom:.1f}% (5日)'
        elif mom < -5: raw_score -= 1.0; signals['モメンタム'] = f'{mom:.1f}% (5日)'

    # ── SMA20 傾き ──
    if n > 10 and _v(sma20, last) and _v(sma20, last - 10):
        slope = (sma20[last] - sma20[last - 10]) / sma20[last - 10] * 100
        if   slope >  1: raw_score += 0.5; signals['SMA20傾き'] = f'上向き (+{slope:.1f}%)'
        elif slope < -1: raw_score -= 0.5; signals['SMA20傾き'] = f'下向き ({slope:.1f}%)'

    # スコア正規化 [-12, +12] → [0, 100]
    normalized = max(0.0, min(100.0, (raw_score + 12) / 24 * 100))

    if normalized >= 62:
        signal     = 'BUY'
        confidence = min(92, int(55 + (normalized - 62) * 1.4))
    elif normalized <= 38:
        signal     = 'SELL'
        confidence = min(92, int(55 + (38 - normalized) * 1.4))
    else:
        signal     = 'HOLD'
        confidence = int(48 + abs(normalized - 50) * 0.6)

    return {
        'symbol':     symbol,
        'price':      float(price),
        'score':      round(normalized, 1),
        'signal':     signal,
        'confidence': confidence,
        'raw_score':  round(raw_score, 2),
        'signals':    signals,
        'rsi':        round(rv, 1) if rv is not None else None,
        'sma20':      round(_v(sma20, last), 2) if _v(sma20, last) else None,
        'sma50':      round(_v(sma50, last), 2) if _v(sma50, last) else None,
        'sma200':     round(_v(sma200, last), 2) if (sma200 is not None and _v(sma200, last)) else None,
    }


def scan_etfs(symbols: list[str]) -> list[dict]:
    """複数ETFを分析してスコア順に並べて返す"""
    import time
    results = []
    for sym in symbols:
        logger.info(f"分析中: {sym}")
        r = score_symbol(sym)
        if r:
            results.append(r)
        time.sleep(0.3)  # レートリミット対策
    return sorted(results, key=lambda x: x['score'], reverse=True)
