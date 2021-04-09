import { Context } from "https://deno.land/x/oak/mod.ts";

const binanceExchangeInfoAPI = "https://api.binance.com/api/v3/exchangeInfo";

export async function getExchangeInfo(
  context: Context<Record<string, any>>,
  next: () => Promise<void>
) {
  const resp = await fetch(binanceExchangeInfoAPI);
  const data = await resp.json();
  context.response.body = data;
}
