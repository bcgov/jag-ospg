# base image
#FROM docker-remote.artifacts.developer.gov.bc.ca/node:12.4.0-alpine as build-stage
FROM node:14.17.0-alpine as build-stage


# set working directory
WORKDIR /web

# add `/web/node_modules/.bin` to $PATH
ENV PATH /web/node_modules/.bin:$PATH

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh


# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_BRANCH
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_BRANCH ${FORMFLOW_SOURCE_REPO_BRANCH}
# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_URL
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_URL ${FORMFLOW_SOURCE_REPO_URL}

# Clone code
RUN git clone -b ${FORMFLOW_SOURCE_REPO_BRANCH} ${FORMFLOW_SOURCE_REPO_URL} /tmp/forms-flow-ai/
RUN cp -r /tmp/forms-flow-ai/forms-flow-web/. /web/

# Customizations
ARG CUSTOM_SRC_DIR=src
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /web/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}/

ARG CUSTOM_PUBLIC_DIR=public
COPY ./  /tmp/${CUSTOM_PUBLIC_DIR}/
RUN cp -R /tmp/${CUSTOM_PUBLIC_DIR}/* /web/ && rm -Rf /tmp/${CUSTOM_PUBLIC_DIR}/

# Build app
RUN npm install
RUN npm run build

#FROM docker-remote.artifacts.developer.gov.bc.ca/nginx:1.17 as production-stage
FROM nginx:1.17 as production-stage
RUN mkdir /nginx
COPY --from=build-stage /web/build /usr/share/nginx/html
COPY --from=build-stage /web/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080:8080
CMD ["nginx", "-g", "daemon off;"]
