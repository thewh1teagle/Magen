# from parent
# sudo docker build -t magen_bot -f telegram_bot/Dockerfile .      
FROM node:17.9.0 AS base

WORKDIR /usr/src/

COPY mobile/api/package.json /usr/src/mobile/api/package.json
WORKDIR /usr/src/mobile/api
RUN npm install

# Install magen common
COPY packages/magen-common/package.json /usr/src/packages/magen-common/package.json
WORKDIR /usr/src/packages/magen-common
RUN npm install

# for build
FROM base as builder

WORKDIR /usr/src
COPY packages /usr/src/packages
COPY mobile/api /usr/src/mobile/api


WORKDIR /usr/src/mobile/api
RUN npm run build

# Production
FROM node:17.9.0-alpine3.15

WORKDIR /usr/src

# Set timezone
RUN apk add --update tzdata
ENV TZ=Asia/Jerusalem

COPY mobile/api/package*.json ./
COPY --from=builder /usr/src/mobile/api/build ./
COPY mobile/api/docker-entrypoint.sh ./
# RUN npm install --only=production


ENTRYPOINT ["/usr/src/docker-entrypoint.sh"]

# ENTRYPOINT ["node","mobile/api/src/main.js"]

