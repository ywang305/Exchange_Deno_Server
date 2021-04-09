import { Application, isHttpError } from "https://deno.land/x/oak/mod.ts";
import router from "./controller/router.ts";
import {
  errorHandler,
  loggerHandler,
  timingHandler,
} from "./middleware/complementary.ts";

const app = new Application();

// Error
app.use(errorHandler);

// Logger
app.use(loggerHandler);

// Timing
app.use(timingHandler);

app.use(router.routes());
app.use(router.allowedMethods()); // cors and no-match reason

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`
  );
});

await app.listen({ port: 8000 });
