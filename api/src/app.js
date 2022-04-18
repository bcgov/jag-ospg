const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const keycloak = require('./keycloak-config.js')
const { configuredSession } = require('./session-config.js')
const cors = require("cors")
const { uploadFile, getFile, removeFile } = require('./routes/files')

const apiVersion = 'v1';

const app = express();

const routes = {
	assignments: require('./routes/assignments'),
	attachments: require('./routes/attachments'),
	categories: require('./routes/categories'),
	communicationLogs: require('./routes/communication-logs'),
	contacts: require('./routes/contacts'),
	dispositionStatuses: require('./routes/disposition-statuses'),
	initialSources: require('./routes/initial-sources'),
	intakeStatuses: require('./routes/intake-statuses'),
	intakeTypes: require('./routes/intake-types'),
	intakes: require('./routes/intakes'),
	issueStatuses: require('./routes/issue-statuses'),
	issues: require('./routes/issues'),
	notes: require('./routes/notes'),
	regulatoryBodies: require('./routes/regulatory-bodies'),
	responseTypes: require('./routes/response-types'),
	roles: require('./routes/roles'),
	topics: require('./routes/topics'),
	users: require('./routes/users'),
	// Add more routes here...
	// items: require('./routes/items'),
};

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// FUTURE: comment it for prod
app.set('json spaces', 2);


// FUTURE: Change it to the correct origin
app.use(
  cors({
    origin: "*",
    credentials: true
  })
)

app.use(configuredSession);

// Install the Keycloak middleware.
app.use(keycloak.middleware({
  logout: '/logout'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

// We provide a root route just as an example
app.get('/', (req, res) => {
	res.send(`API is running...`);
});

// Example how to protect a service with keycloak
// https://github.com/keycloak/keycloak-nodejs-connect/blob/main/keycloak.d.ts#L297
// https://wjw465150.gitbooks.io/keycloak-documentation/content/securing_apps/topics/oidc/nodejs-adapter.html
app.get(`/api/${apiVersion}/protected`, keycloak.protect('formsflow-client'), function (req, res) {
    res.send('{"test": "Private details"}')
});

// Files endpoint
app.post(`/api/${apiVersion}/files`, keycloak.protect(), uploadFile)
app.get(`/api/${apiVersion}/files/:fileId`, keycloak.protect(), getFile)
app.delete(`/api/${apiVersion}/files/:fileId`, keycloak.protect(), removeFile)

// Define REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getByQuery) {
		app.get(
			`/api/${apiVersion}/${routeName}`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.getByQuery)
		);
	}	
	if (routeController.getAll) {
		app.get(
			`/api/${apiVersion}/${routeName}`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.getAll)
		);
	}
	if (routeController.getById) {
		app.get(
			`/api/${apiVersion}/${routeName}/:id`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.getById)
		);
	}
	if (routeController.create) {
		app.post(
			`/api/${apiVersion}/${routeName}`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.create)
		);
	}
	if (routeController.update) {
		app.put(
			`/api/${apiVersion}/${routeName}/:id`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.update)
		);
	}
	if (routeController.updateByApplicationId) {
		app.put(
			`/api/${apiVersion}/${routeName}/`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.updateByApplicationId)
		);
	}
	if (routeController.updateBulk) {
		app.put(
			`/api/${apiVersion}/${routeName}/`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.updateBulk)
		);
	}
	if (routeController.remove) {
		app.delete(
			`/api/${apiVersion}/${routeName}/:id`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		);
	}
	if (routeController.removeBulk) {
		app.delete(
			`/api/${apiVersion}/${routeName}/`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.removeBulk)
		);
	}
}

module.exports = app;
