FROM node:20 AS builder

ARG VITE_PASSMETA_API
ENV VITE_PASSMETA_API=$VITE_PASSMETA_API

WORKDIR /deploy
CMD rm -r /deploy/dist
COPY . .

RUN yarn install
CMD yarn build
