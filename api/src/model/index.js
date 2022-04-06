const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');

// FUTURE: keep the database connection URL as an environment variable.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
// const sequelize = new Sequelize({
// 	dialect: 'sqlite',
// 	storage: 'sqlite-example-database/example-db.sqlite',
// 	logQueryParameters: true,
// 	benchmark: true
// });

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USE_POSTGRES = process.env.DB_USE_POSTGRES;

let sequelize = null;

if (DB_USE_POSTGRES==="true") {
	console.log('Connecting to Postgres DB')
	console.log('DB_NAME:', DB_NAME)
	sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
		host: DB_HOST,
		port: DB_PORT,
		dialect: 'postgres',
	})
} else {
	console.log('Connecting to MSSQL DB')
	console.log('DB_NAME:', DB_NAME)
	sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
		host: DB_HOST,
		port: DB_PORT,
		dialect: 'mssql',
		dialectOptions: {
		  options: {
			// useUTC: false,
			// dateFirst: 1,
		  }
		}
	})
}


const modelDefiners = [
	require('./assignment.model'),
	require('./attachment.model'),
	require('./communication-log.model'),
	require('./contact.model'),
	require('./category.model'),
	require('./disposition-status.model'),
	require('./initial-source.model'),
	require('./intake-status.model'),
	require('./intake-type.model'),
	require('./intake.model'),
	require('./issue-category.model'),
	require('./issue-regulatory-body.model'),
	require('./issue-status.model'),
	require('./issue.model'),
	require('./note.model'),
	require('./regulatory-body.model'),
	require('./response-type.model'),
	require('./role.model'),
	require('./topic.model'),
	require('./user.model'),

	// Add more models here...
	// require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
