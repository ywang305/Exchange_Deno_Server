docker stop app || true

docker build -t app . && docker run -it -rm --init -p 1993:1993 app