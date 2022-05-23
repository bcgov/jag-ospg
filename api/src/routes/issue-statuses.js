const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	if (req.query.active) {
		if (req.query.active === 'true' || req.query.active === 'false') {
			try {
				const issueStatuses = await models.issueStatus.findAll({
					where: 
					{ 
						isActive: req.query.active === 'true' ? true : false
					},
					order: ['issueStatus']
				});
				res.status(200).json(issueStatuses);
			} catch (e) {
				console.log(e.message);
				res.status(500).send(e.message);
			}
		} else {
			res.status(400).send(`Bad request: request query active param should be true or false.`)
		}
	} else {
		const issueStatuses = await models.issueStatus.findAll({order: ['issueStatus']});
		res.status(200).json(issueStatuses);
	}
};

async function getById(req, res) {
	const id = getIdParam(req);
	const issueStatus = await models.issueStatus.findByPk(id);
	if (issueStatus) {
		res.status(200).json(issueStatus);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.issueStatus.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.issueStatus.update(req.body, {
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
	await models.issueStatus.destroy({
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
