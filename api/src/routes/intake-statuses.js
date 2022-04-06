const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	if (req.query.active) {
		if (req.query.active === 'true' || req.query.active === 'false') {
			const intakeStatuses = await models.intakeStatus.findAll({
				where: 
				{ 
					isActive: req.query.active === 'true' ? true : false
				}
			});
			res.status(200).json(intakeStatuses);
		} else {
			res.status(400).send(`Bad request: request query active param should be true or false.`)
		}
	} else {
		const intakeStatuses = await models.intakeStatus.findAll();
		res.status(200).json(intakeStatuses);
	}
};

async function getById(req, res) {
	const id = getIdParam(req);
	const intakeStatus = await models.intakeStatus.findByPk(id);
	if (intakeStatus) {
		res.status(200).json(intakeStatus);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.intakeStatus.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.intakeStatus.update(req.body, {
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
	await models.intakeStatus.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
};
