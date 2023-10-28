# from parent
# docker build -t magen_telegram_bot -f telegram_bot/Dockerfile .
FROM node:17.9.0 AS base

WORKDIR /usr/src/

COPY telegram_bot/package.json /usr/src/telegram_bot/package.json
WORKDIR /usr/src/telegram_bot/
RUN npm install


# for build
FROM base as builder

WORKDIR /usr/src
COPY packages /usr/src/packages
COPY telegram_bot telegram_bot


WORKDIR /usr/src/telegram_bot
RUN ls -r /usr/src/
RUN ls
RUN npm run build

# for production

FROM node:17.9.0-alpine3.15

WORKDIR /usr/src/telegram_bot

COPY telegram_bot/package*.json ./

RUN npm install --only=production

COPY --from=builder /usr/src/telegram_bot/build ./

ENTRYPOINT ["node","./main.js"]