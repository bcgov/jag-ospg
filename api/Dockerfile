FROM artifacts.developer.gov.bc.ca/docker-remote/node:18.10-alpine as build-stage

# set working directory
WORKDIR /api

# add `/api/node_modules/.bin` to $PATH
ENV PATH /api/node_modules/.bin:$PATH

RUN apk update && apk add busybox-extras

COPY . /api/

RUN npm install
EXPOSE 3003:3003
USER node
CMD ["node", "src/index.js"]
