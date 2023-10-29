# from parent
# sudo docker build -t magen_bot -f telegram_bot/Dockerfile .      
FROM node:17.9.0 AS base

WORKDIR /usr/src/

COPY telegram_bot/package.json /usr/src/telegram_bot/package.json
WORKDIR /usr/src/telegram_bot/
RUN npm install


# for build
FROM base as builder

WORKDIR /usr/src
COPY packages /usr/src/packages
COPY telegram_bot /usr/src/telegram_bot


WORKDIR /usr/src/telegram_bot
RUN npm run build

# for production

FROM node:17.9.0-alpine3.15

WORKDIR /usr/src

COPY telegram_bot/package*.json ./

RUN npm install --only=production

COPY packages/static_map/src/assets /usr/src/packages/static_map/src/assets
COPY --from=builder /usr/src/telegram_bot/build ./

ENTRYPOINT ["node","telegram_bot/src/main.js"]