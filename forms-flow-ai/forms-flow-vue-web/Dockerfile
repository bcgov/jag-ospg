# base image
#FROM docker-remote.artifacts.developer.gov.bc.ca/node:12.4.0-alpine as build-stage
FROM node:14.17.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 4000:8080
CMD ["nginx", "-g", "daemon off;"]
