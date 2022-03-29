const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	if (req.query.active) {
		if (req.query.active === 'true' || req.query.active === 'false') {
			const responseTypes = await models.responseType.findAll({
				where: 
				{ 
					isActive: req.query.active === 'true' ? true : false
				}
			});
			res.status(200).json(responseTypes);
		} else {
			res.status(400).send(`Bad request: request query active param should be true or false.`)
		}
	} else {
		const responseTypes = await models.responseType.findAll();
		res.status(200).json(responseTypes);
	}
};

async function getById(req, res) {
	const id = getIdParam(req);
	const responseType = await models.responseType.findByPk(id);
	if (responseType) {
		res.status(200).json(responseType);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.responseType.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.responseType.update(req.body, {
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
	await models.responseType.destroy({
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
