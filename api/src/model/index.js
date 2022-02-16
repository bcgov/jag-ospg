const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');

// FUTURE: keep the database connection URL as an environment variable.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'sqlite-example-database/example-db.sqlite',
	logQueryParameters: true,
	benchmark: true
});

const modelDefiners = [
	require('./attachment.model'),
	require('./communication-log.model'),
	require('./contact.model'),
	require('./category.model'),
	require('./disposition-status.model'),
	require('./intake-status.model'),
	require('./intake-type.model'),
	require('./intake.model'),
	require('./issue.model'),
	require('./regulatory-body.model'),
	require('./response-type.model'),
	require('./role.model'),
	require('./user.model'),

	require('./issue-category.model'),
	require('./issue-regulatory-body.model'),

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
