const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const notes = await models.note.findAll();
	res.status(200).json(notes);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const note = await models.note.findByPk(id);
	if (note) {
		res.status(200).json(note);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByQuery(req, res) {
	if (req.query.intakeId) {
		const notes = await models.note.findAll({ 
			where: { 
				intakeId: req.query.intakeId 
			}
		});
		if (notes) {
			res.status(200).json(notes);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else getAll(req, res); 
};

async function create(req, res) {
	if (!req.body.id) {
		res.status(400).send(`Bad request: ID should be provided.`)
	} else {
		await models.note.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.note.update(req.body, {
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
	await models.note.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	//"allAuth": true,
	getAll,
	getById,
	getByQuery,
	create,
	update,
	remove,
};
