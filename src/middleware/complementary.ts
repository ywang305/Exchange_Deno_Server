import { Context, isHttpError } from "https://deno.land/x/oak/mod.ts";

type Ctx = Context;

export const errorHandler = async (ctx: Ctx, next: any) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      ctx.response.status = err.status;
      ctx.response.body = err.message;
    } else {
      // rethrow if you can't handle the error
      throw err;
    }
  }
};

export const loggerHandler = async (ctx: Ctx, next: any) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
};

export const timingHandler = async (ctx: Ctx, next: any) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
};
