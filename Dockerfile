FROM node:alpine AS base

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

ENTRYPOINT [ "npm", "start" ]
