# from parent
# docker build -t magen_telegram_bot -f telegram_bot/Dockerfile .
FROM node:17.9.0 AS base

WORKDIR /usr/src/app/telegram_bot

COPY telegram_bot/package*.json ./
    
RUN npm install

COPY telegram_bot .


# for build

FROM base as builder

WORKDIR /usr/src/app/telegram_bot
COPY telegram_bot/src src
COPY static_map ../static_map
COPY data ../data

RUN npm run build


# for production

FROM node:17.9.0-alpine3.15

WORKDIR /usr/src/app/telegram_bot

COPY telegram_bot/package*.json ./

RUN npm install --only=production

COPY --from=builder /usr/src/app/telegram_bot/build ./

ENTRYPOINT ["node","./main.js"]