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
	if (req.query.name) {
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
			res.status(200).json([]);;
		}
	} else getAll(req, res)
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else if (typeof req.body === 'object' &&
				!Array.isArray(req.body) &&
				req.body !== null) {
		try {
			const persistedContact = await models.contact.create(req.body);
			res.status(201).json(persistedContact);
		} catch (e) {
			if (e instanceof Sequelize.ValidationError) {
				return res.status(422).send(e.errors);
			} else {
				return res.status(400).send({
					message: e.message
				});
			}
		}
	} else if (Array.isArray(req.body)) {
		try {
			const persistedContacts = await sequelize.models.contact.bulkCreate(req.body);
			res.status(201).json(persistedContacts);
		} catch (e) {
			if (e instanceof Sequelize.ValidationError) {
				return res.status(422).send(e.errors);
			} else {
				return res.status(400).send({
					message: e.message
				});
			}
		}
	} else res.status(400).send(`Bad request: wrong body.`);
};

async function update(req, res) {
	const id = getIdParam(req);
	try {
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
	} catch (e) {
		if (e instanceof Sequelize.ValidationError) {
			return res.status(422).send(e.errors);
		} else {
			return res.status(400).send({
				message: e.message
			});
		}
	}
};

async function updateBulk(req, res) {
	if (Array.isArray(req.body)) {
		try {
			await sequelize.transaction(async (t) => {
				req.body.forEach(async contact => {
					await models.contact.update(contact, {
						where: {
							id: contact.id
						}, 
						transaction: t,
					});
				});
				const updatedContactIds = 
				req.body.map(contact => contact.id);
				const contacts = await models.contact.findAll({
					where: {
						id: updatedContactIds
					}, 
					transaction: t,
				});
				res.status(200).json(contacts);
			});
		} catch (e) {
			if (e instanceof Sequelize.ValidationError) {
				return res.status(422).send(e.errors);
			} else {
				return res.status(400).send({
					message: e.message
				});
			}
		}
	} else {
		res.status(400).send(`Bad request: body should be a list for bulk update.`);
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

async function removeBulk(req, res) {
	if (Array.isArray(req.body)) {
		try {
			req.body.forEach(async contact => {
				await models.contact.destroy({
					where: {
						id: contact.id
					}
				});
			});
			res.status(200).end();
		} catch (e) {
			if (e instanceof Sequelize.ValidationError) {
				return res.status(422).send(e.errors);
			} else {
				return res.status(400).send({
					message: e.message
				});
			}
		}
	} else {
		res.status(400).send(`Bad request: body should be a list for bulk delete.`);
	}
};

module.exports = {
	getAll,
	getById,
	getByQuery,
	create,
	update,
	updateBulk,
	remove,
	removeBulk
};
