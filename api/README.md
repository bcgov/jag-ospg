# Line of business API


## Run API

```
npm install
npm run setup-example-db
npm run start
```

## Docker Build

```
docker build -t jag-ospg-api .
```

## Docker Run

```
docker run -p 3003:3003 \
-e KEYCLOAK_REALM="forms-flow-ai" \
-e KEYCLOAK_AUTH_SERVER_URL="http://host.docker.internal:8080/auth/" \
-e KEYCLOAK_CLIENT_ID="forms-flow-web" \
-e DB_NAME="ospgdb" \
-e DB_USERNAME="<USER>" \
-e DB_PASSWORD="<PASS>" \
-e DB_HOST="<HOST>" \
-e DB_PORT="<PORT>" \
-e S3_BUCKETNAME="<BUCKET_NAME>" \
-e S3_ACCESS_KEY_ID="<ACCESS_KEY>" \
-e S3_SECRET_ACCESS_KEY="<SECRET_ACCESS_KEY>" \
-e S3_HOST="<HOST>" \
jag-ospg-api 
```