#Getting base image from CentOS 7
FROM registry.connect.redhat.com/mongodb/enterprise-database:latest

MAINTAINER Victor Ameh <victor.ameh@aot-technologies.com>

LABEL Remarks="Dockerfile to update packages to address vulnerability CVE-2021-43527"

#Update Software Repository

RUN yum -y update
