# base image
#FROM docker-remote.artifacts.developer.gov.bc.ca/node:12.4.0-alpine as build-stage
FROM node:14.17.0-alpine as build-stage

# set working directory
WORKDIR /api

# add `/api/node_modules/.bin` to $PATH
ENV PATH /api/node_modules/.bin:$PATH

COPY . /api/

RUN apk update && apk add busybox-extras

RUN npm install

RUN node src/sqlite-example-database/setup.js

EXPOSE 3003:3003
CMD ["npm", "run", "start"]
