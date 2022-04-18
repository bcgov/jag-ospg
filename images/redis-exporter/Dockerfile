FROM oliver006/redis_exporter:alpine

MAINTAINER Victor Ameh <victor.ameh@aot-technologies.com>

LABEL Remarks="Adding Dockerfile to update packages to address vulnerability RHSA-2022:1069 - Security Advisory "

#Update Software Repository
USER root

RUN apk update 

RUN apk upgrade --available && sync

USER default
