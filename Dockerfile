FROM hayd/alpine-deno:1.8.3

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

# These steps will be re-run upon each file change in your working directory:
COPY ./src .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]