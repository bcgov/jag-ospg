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
app.post(`/api/${apiVersion}/files`, uploadFile)
app.get(`/api/${apiVersion}/files/:fileId`, getFile)
app.delete(`/api/${apiVersion}/files/:fileId`, removeFile)

// Define REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getByQuery) {
		if (routeController.allAuth || routeController.getByQuery_auth) {
			app.get(
				`/api/${apiVersion}/${routeName}`,
				keycloak.protect(),
				makeHandlerAwareOfAsyncErrors(routeController.getByQuery)
			);
		} else {
			app.get(
				`/api/${apiVersion}/${routeName}`,
				makeHandlerAwareOfAsyncErrors(routeController.getByQuery)
			);
		}
	}	
	if (routeController.getAll) {
		if (routeController.allAuth || routeController.getAll_auth) {
			app.get(
				`/api/${apiVersion}/${routeName}`,
				keycloak.protect(),
				makeHandlerAwareOfAsyncErrors(routeController.getAll)
			);
		} else {
			app.get(
				`/api/${apiVersion}/${routeName}`,
				makeHandlerAwareOfAsyncErrors(routeController.getAll)
			);
		}
	}
	if (routeController.getById) {
		if (routeController.allAuth || routeController.getById_auth) {
			app.get(
				`/api/${apiVersion}/${routeName}/:id`,
				keycloak.protect(),
				makeHandlerAwareOfAsyncErrors(routeController.getById)
			);
		} else {
			app.get(
				`/api/${apiVersion}/${routeName}/:id`,
				makeHandlerAwareOfAsyncErrors(routeController.getById)
			);
		}
	}
	if (routeController.create) {
		if (routeController.allAuth || routeController.create_auth) {
			app.post(
				`/api/${apiVersion}/${routeName}`,
				keycloak.protect(),
				makeHandlerAwareOfAsyncErrors(routeController.create)
			);
		} else {
			app.post(
				`/api/${apiVersion}/${routeName}`,
				makeHandlerAwareOfAsyncErrors(routeController.create)
			);
		}
	}
	if (routeController.update) {
		if (routeController.allAuth || routeController.update_auth) {
			app.put(
				`/api/${apiVersion}/${routeName}/:id`,
				keycloak.protect(),
				makeHandlerAwareOfAsyncErrors(routeController.update)
			);
		} else {
			app.put(
				`/api/${apiVersion}/${routeName}/:id`,
				makeHandlerAwareOfAsyncErrors(routeController.update)
			);
		}
	}
	if (routeController.updateByApplicationId) {
		if (routeController.allAuth || routeController.updateByApplicationId_auth) {
			app.put(
				`/api/${apiVersion}/${routeName}/`,
				keycloak.protect(),
				makeHandlerAwareOfAsyncErrors(routeController.updateByApplicationId)
			);
		} else {
			app.put(
				`/api/${apiVersion}/${routeName}/`,
				makeHandlerAwareOfAsyncErrors(routeController.updateByApplicationId)
			);
		}
	}
	if (routeController.remove) {
		if (routeController.allAuth || routeController.remove_auth) {
			app.delete(
				`/api/${apiVersion}/${routeName}/:id`,
				keycloak.protect(),
				makeHandlerAwareOfAsyncErrors(routeController.remove)
			);
		} else {
			app.delete(
				`/api/${apiVersion}/${routeName}/:id`,
				makeHandlerAwareOfAsyncErrors(routeController.remove)
			);
		}
	}
}

module.exports = app;
