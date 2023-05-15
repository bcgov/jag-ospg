FROM image-registry.openshift-image-registry.svc:5000/bcgov/postgresql:12.4

MAINTAINER Victor Ameh <victor.ameh@aot-technologies.com>

LABEL Remarks="Adding Dockerfile to update packages to address vulnerability RHSA-2022:1069 - Security Advisory "

#Update Software Repository
USER root

RUN yum -y update

USER default
