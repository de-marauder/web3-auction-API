FROM node:alpine AS base

WORKDIR /app

RUN apk update --no-cache

COPY package*.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

ENTRYPOINT [ "yarn", "start" ]
