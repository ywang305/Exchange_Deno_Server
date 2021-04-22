import { Context, helpers } from 'https://deno.land/x/oak/mod.ts';

const binanceExchangeInfoAPI = 'https://api.binance.com/api/v3/exchangeInfo';
const binanceKlines = 'https://api.binance.com/api/v3/klines'; // ?symbol=BTCUSDT&interval=30m;

export async function getPairs(
    context: Context<Record<string, any>>,
    next: () => Promise<void>
) {
    const resp = await fetch(binanceExchangeInfoAPI);
    const data = await resp.json();
    const symbols = data.symbols.map(mapSymbolToPair).filter(selectCoin);
    context.response.body = symbols;
}

function mapSymbolToPair(symbol: { baseAsset: string; quoteAsset: string }) {
    const { baseAsset, quoteAsset } = symbol;
    return { coin: baseAsset, baseCoin: quoteAsset };
}

const coinSet = new Set([
    'BTC',
    'ETH',
    'LTC',
    'BAT',
    'FIL',
    'BCH',
    'ATOM',
    'COMP',
    'DOGE',
]);
const baseCoinSet = new Set(['BTC', 'ETH', 'DOGE', 'USDT', 'USDC', 'DAI']);
function selectCoin(symbol: { coin: string; baseCoin: string }) {
    return coinSet.has(symbol.coin) && baseCoinSet.has(symbol.baseCoin);
}
function mapKlineArrayToObject([
    openTime,
    open,
    high,
    low,
    close,
    volume,
    closeTime,
]: Array<any>) {
    return { openTime, open, high, low, close, volume, closeTime };
}

export async function getHistoryKlines(
    context: Context<Record<string, any>>,
    next: () => Promise<void>
) {
    const { symbol, interval } = helpers.getQuery(context);
    const resp = await fetch(
        binanceKlines + `?symbol=${symbol}&interval=${interval}`
    );
    const data = await resp.json();
    context.response.body = data.map(mapKlineArrayToObject);
}

export function checkTime(context: Context<Record<string, any>>) {
    context.response.body = { serverTime: new Date().toISOString() };
}
