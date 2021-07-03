import { Router } from "https://deno.land/x/oak/mod.ts";
import { Status } from "https://deno.land/std/http/http_status.ts";
import { getPairs, getHistoryKlines, checkTime } from "./market.ts";
import { getTwitts } from "./twitter.ts";

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "The Hound of the Baskervilles",
  author: "Conan Doyle, Arthur",
});

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello Borger!";
  })
  .get("/book", (context) => {
    context.response.body = Array.from(books.values());
  })
  .get(
    "/book/:id",
    async (ctx, next) => {
      const id = ctx.params.id;
      if (!id || !books.has(id))
        ctx.throw(Status.Conflict, "Not Valid Book ID");
      await next();
    },
    (context, next) => {
      const book = books.get(context?.params?.id ?? "");
      context.response.body = book;
    }
  );

router
  .get("/exchangeInfo/pairs", getPairs)
  .get("/klines", getHistoryKlines)
  .get("/time", checkTime)
  .get("/api/twitter_search", getTwitts);

export default router;
