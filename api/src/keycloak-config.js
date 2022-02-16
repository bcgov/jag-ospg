const Keycloak = require('keycloak-connect');
const { memoryStore } = require('./session-config.js')

// Provide the session store to the Keycloak so that sessions
// can be invalidated from the Keycloak console callback.
//
// Additional configuration is read from keycloak.json file
// installed from the Keycloak web console.

const keycloak = new Keycloak({
    store: memoryStore
});

module.exports = keycloak;