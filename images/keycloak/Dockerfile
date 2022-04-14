FROM quay.io/keycloak/keycloak

MAINTAINER Victor Ameh <victor.ameh@aot-technologies.com>

LABEL Remarks="Adding Dockerfile to update packages to address vulnerability RHSA-2021:2065 - Security Advisory "

#Update Software Repository
USER root

RUN yum -y update

USER default

