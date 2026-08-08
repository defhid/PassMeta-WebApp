FROM node:22.23-slim AS builder

WORKDIR /deploy
CMD rm -r /deploy/dist
COPY . .

RUN npm ci
CMD npm run build
