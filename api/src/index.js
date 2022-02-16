const app = require('./app');
const sequelize = require('./model');
const serverPort = 3003;


async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();
	app.listen(serverPort, () => {
		console.log(`Server started on port ${serverPort}.`);
	});
}

init();
