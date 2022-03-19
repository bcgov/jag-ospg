const sequelize = require('../model');
const { Op } = require('sequelize');
const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const contacts = await models.contact.findAll();
	res.status(200).json(contacts);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const contact = await models.contact.findByPk(id);
	if (contact) {
		res.status(200).json(contact);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByQuery(req, res) {
	if (req.query.name && req.query.name.length >= 3) {
		const query = req.query.name;
		const contacts = await models.contact.findAll(
			{ 
				where: {
					[Op.or]:[
						{
							firstName: sequelize.where(sequelize.fn('LOWER', sequelize.col('firstName')), 'LIKE', '%' + query + '%')
						}, 
						{
							middleName: sequelize.where(sequelize.fn('LOWER', sequelize.col('middleName')), 'LIKE', '%' + query + '%')
						}, 
						{
							lastName: sequelize.where(sequelize.fn('LOWER', sequelize.col('lastName')), 'LIKE', '%' + query + '%')
						}
					]
				}
			});
		if (contacts?.length) {
			res.status(200).json(contacts);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else getAll(req, res)
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.contact.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.contact.update(req.body, {
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
	await models.contact.destroy({
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
