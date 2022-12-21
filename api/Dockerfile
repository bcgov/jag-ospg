# base image
#FROM docker-remote.artifacts.developer.gov.bc.ca/node:12.4.0-alpine as build-stage
FROM artifacts.developer.gov.bc.ca/docker-remote/node:18.10-alpine as build-stage

# set working directory
WORKDIR /api

# add `/api/node_modules/.bin` to $PATH
ENV PATH /api/node_modules/.bin:$PATH

COPY . /api/

RUN apk update && apk add busybox-extras

RUN wget https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.9.1.1-1_amd64.apk
RUN wget https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.9.1.1-1_amd64.apk
RUN apk add --allow-untrusted msodbcsql17_17.9.1.1-1_amd64.apk
RUN apk add --allow-untrusted mssql-tools_17.9.1.1-1_amd64.apk

#Install curl
RUN apk add curl

RUN apk add unixodbc-dev

FROM build-stage
RUN npm install
# RUN node src/sqlite-example-database/setup.js
EXPOSE 3003:3003
RUN deluser --remove-home node \
  && addgroup -S node -g 9999 \
  && adduser -S -G node -u 9999 node
USER node
#CMD ["npm", "run", "start"]
CMD ["node", "index.js"]
