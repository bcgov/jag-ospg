# base image
FROM alpine

# set working directory
WORKDIR /aws

RUN apk update 

#Install curl
RUN apk add curl

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

CMD tail -f /dev/null

