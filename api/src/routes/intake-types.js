const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	if (req.query.active) {
		if (req.query.active === 'true' || req.query.active === 'false') {
			const intakeTypes = await models.intakeType.findAll({
				where: 
				{ 
					isActive: req.query.active === 'true' ? 1 : 0
				}
			});
			res.status(200).json(intakeTypes);
		} else {
			res.status(400).send(`Bad request: request query active param should be true or false.`)
		}
	} else {
		const intakeTypes = await models.intakeType.findAll();
		res.status(200).json(intakeTypes);
	}
};

async function getById(req, res) {
	const id = getIdParam(req);
	const intakeType = await models.intakeType.findByPk(id);
	if (intakeType) {
		res.status(200).json(intakeType);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.intakeType.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.intakeType.update(req.body, {
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
	await models.intakeType.destroy({
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
