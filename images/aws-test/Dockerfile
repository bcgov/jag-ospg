# base image
#FROM docker-remote.artifacts.developer.gov.bc.ca/node:12.4.0-alpine as build-stage
FROM node:14.17.0-alpine as build-stage
# set working directory
WORKDIR /aws
# add `/api/node_modules/.bin` to $PATH
ENV PATH /api/node_modules/.bin:$PATH
#COPY . /api/
RUN apk update && apk add busybox-extras

#Install curl
RUN apk add curl
RUN set -ex && apk --no-cache add sudo
ENV USER_NAME="aws-user"

RUN addgroup --gid 1001 -S $USER_NAME && \
    adduser -G $USER_NAME --shell /bin/false --disabled-password -H --uid 1001 $USER_NAME && \
    mkdir -p /var/log/$USER_NAME && \
    chown $USER_NAME:$USER_NAME /var/log/$USER_NAME

#  Add new user docker to sudo group
RUN adduser $USER_NAME sudo  
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> \
/etc/sudoers

RUN apk add --update --no-cache curl ca-certificates \
    && curl -sL -o /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub \
    && curl -sL -o glibc-2.28-r0.apk https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk \
    && apk add glibc-2.28-r0.apk \
    && curl -sL -o glibc-bin-2.28-r0.apk https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-bin-2.28-r0.apk \
    && apk add glibc-bin-2.28-r0.apk \
    && curl -sL -o awscliv2.zip https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.0.30.zip \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -Rf aws/ awscliv2.zip glibc-2.28-r0.apk glibc-bin-2.28-r0.apk \
    && aws --version
    
RUN apk add unixodbc-dev
RUN npm install

EXPOSE 3003:3003
USER $USER_NAME
CMD ["npm", "run", "start"]
