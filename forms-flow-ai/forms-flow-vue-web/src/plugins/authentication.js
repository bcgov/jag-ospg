import Keycloak from "keycloak-js";

const options = {
  url: `${process.env.VUE_APP_KEYCLOAK_URL}/auth`,
  realm: process.env.VUE_APP_KEYCLOAK_URL_REALM,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
};

const _keycloak = Keycloak(options);

export default _keycloak;
