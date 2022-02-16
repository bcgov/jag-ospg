# Line of business API

## Docker Build
docker build -t jag-ospg-api .

## Docker Run
docker run -p 3003:3003 \
-e KEYCLOAK_REALM="forms-flow-ai" \
-e KEYCLOAK_AUTH_SERVER_URL="http://host.docker.internal:8080/auth/" \
-e KEYCLOAK_CLIENT_ID="forms-flow-web" \
jag-ospg-api 