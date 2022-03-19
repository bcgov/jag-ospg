const Sequelize = require('sequelize');
const sequelize = require('../model');
const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const issues = await models.issue.findAll();
	res.status(200).json(issues);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const issue = await models.issue.findByPk(id, { include: { all: true }});
	if (issue) {
		res.status(200).json(issue);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		try {
			await sequelize.transaction(async (t) => {
				const persistedObj = await models.issue.create(req.body,
					{	
						transaction: t,
						include: [
							{ model: models.issueCategory }, 
							{ model: models.issueRegulatoryBody }
						] 
					} );
				await models.issue.update({ issueNumber: 'ISSUE-'+persistedObj.id }, {
					where: {
						id: persistedObj.id
					}, 
					transaction: t,
				});
				const issue = await models.issue.findByPk(persistedObj.id, 
					{ 
						include: { all: true }, 
						transaction: t,
					});
				res.status(201).json(issue.dataValues);       
			});     
        } catch(e) {
            if (e instanceof Sequelize.ValidationError) {
				return res.status(422).send(e.errors);
			} else {
				return res.status(400).send({
					message: e.message
				});
			}
        };
	}
};

function getUpdatableFields(fullObj) {
	const fieldsToExclude = ['id', 'applicationId', 'issueNumber']; 
	return Object.keys(fullObj).filter( s => !fieldsToExclude.includes(s))
}

async function update(req, res) {
	try {
		const id = getIdParam(req);
		await sequelize.transaction(async (t) => {
			// We only accept an UPDATE request if the `:id` param matches the body `id`
			if (req.body.id === id) {
				const updatedRows = await models.issue.update(req.body, {
					where: {
						id: id
					},
					transaction: t
				});
				if (updatedRows[0] > 0) {
					await updateIssueCategories(req, t);
					await updateIssueRegulatoryBodies(req, t);
					const updatedObj = await models.issue.findOne({ 
						where: { 
							id: id
						}, 
						include: { all: true },
						transaction: t,
					});
					if (updatedObj) {
						res.status(200).json(updatedObj);
					} 
				} else {
					res.status(404).send('404 - Not found');
				}
			} else {
				res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
			}
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
};

async function updateByApplicationId(req, res) {
	if (req.query.applicationId) { 
		await sequelize.transaction(async (t) => {
			const updatableFields = getUpdatableFields(req.body)
			try {
				const oldObj = await models.issue.findOne(
					{ 
						where: { 
							applicationId: req.query.applicationId 
						} , 
						include: { 
							all: true 
						},
						transaction: t,
					});
				req.body.id = oldObj.id;
				const updatedRows = await models.issue.update(req.body, {
					where: {
						applicationId: req.query.applicationId
					},
					fields: updatableFields,
					transaction: t,
				});
				if (updatedRows[0] > 0) {
					await updateIssueCategories(req, t);
					await updateIssueRegulatoryBodies(req, t);
					const updatedObj = await models.issue.findOne(
						{ 
							where: { applicationId: req.query.applicationId },
							include: { all: true },
							transaction: t,
						});
					if (updatedObj) {
						res.status(200).json(updatedObj);
					} 
				} else {
					res.status(404).send('404 - Not found');
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
		});
	} else {
		res.status(400).send(`Bad request: applicationId query required.`);
	}
}

async function updateIssueCategories(req, t) {
	const issueId = req.body.id;
	const newIssueCategories = req.body.issueCategories || [];
		
	const newIssueCategoriesIds = newIssueCategories.map(issueCategory => issueCategory.categoryId);
	const oldIssueCategories = await models.issueCategory.findAll({
		where: {
			issueId: issueId 
		},
		transaction: t,
	});
	const oldIssueCategoriesIds = oldIssueCategories.map(issueCategory => issueCategory.categoryId)
	const deletedIssueCategories = oldIssueCategoriesIds.filter(x => !newIssueCategoriesIds.includes(x));
	const addedIssueCategories = newIssueCategoriesIds.filter(x => !oldIssueCategoriesIds.includes(x));
	
	oldIssueCategories.forEach(async n => {
		if (deletedIssueCategories.includes(n.categoryId)) {
			await models.issueCategory.destroy({
				where: {
					categoryId: n.categoryId
				},
				transaction: t,
			});
		}
	});
	newIssueCategories.forEach(async n => {
		if (addedIssueCategories.includes(n.categoryId)) {
			n.issueId = issueId;
			await models.issueCategory.create(n, {transaction: t});
		}
	});
}

async function updateIssueRegulatoryBodies(req, t) {
	const issueId = req.body.id;
	const newIssueRegulatoryBodies = req.body.issueRegulatoryBodies || [];
		
	const newIssueRegulatoryBodiesIds = newIssueRegulatoryBodies.map(issueRegulatoryBody => issueRegulatoryBody.regulatoryBodyId);
	const oldIssueRegulatoryBodies = await models.issueRegulatoryBody.findAll({
		where: {
			issueId: issueId 
		},
		transaction: t,
	});
	const oldIssueRegulatoryBodiesIds = oldIssueRegulatoryBodies.map(issueRegulatoryBody => issueRegulatoryBody.regulatoryBodyId)
	const deletedIssueRegulatoryBodies = oldIssueRegulatoryBodiesIds.filter(x => !newIssueRegulatoryBodiesIds.includes(x));
	const addedIssueRegulatoryBodies = newIssueRegulatoryBodiesIds.filter(x => !oldIssueRegulatoryBodiesIds.includes(x));
	
	oldIssueRegulatoryBodies.forEach(async n => {
		if (deletedIssueRegulatoryBodies.includes(n.regulatoryBodyId)) {
			await models.issueRegulatoryBody.destroy({
				where: {
					regulatoryBodyId: n.regulatoryBodyId,
					issueId: issueId 
				},
				transaction: t,
			});
		}
	});
	newIssueRegulatoryBodies.forEach(async n => {
		if (addedIssueRegulatoryBodies.includes(n.regulatoryBodyId)) {
			n.issueId = issueId;
			await models.issueRegulatoryBody.create(n, {transaction: t});
		}
	});
}

async function remove(req, res) {
	const id = getIdParam(req);
	await models.issue.destroy({
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
	updateByApplicationId,
	remove,
};
