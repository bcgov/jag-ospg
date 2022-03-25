const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const communicationLogs = await models.communicationLog.findAll();
	res.status(200).json(communicationLogs);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const communicationLog = await models.communicationLog.findByPk(id);
	if (communicationLog) {
		res.status(200).json(communicationLog);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByQuery(req, res) {
	if (req.query.intakeId) {
		const communicationLogs = await models.communicationLog.findAll({ 
			where: { 
				intakeId: req.query.intakeId 
			}
		});
		if (communicationLogs) {
			res.status(200).json(communicationLogs);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else getAll(req, res); 
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.communicationLog.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.communicationLog.update(req.body, {
			where: {
				id: id
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
	}
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.communicationLog.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	getAll,
	getById,
	getByQuery,
	create,
	update,
	remove,
};
