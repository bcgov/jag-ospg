const Sequelize = require('sequelize');
const sequelize = require('../model');
const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const intakes = await models.intake.findAll();
	res.status(200).json(intakes);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const intake = await models.intake.findByPk(id, { include: { all: true }});
	if (intake) {
		res.status(200).json(intake);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByQuery(req, res) {
	if (req.query.applicationId) {
		const intake = await models.intake.findOne({ where: { applicationId: req.query.applicationId } , include: { all: true }});
		if (intake) {
			res.status(200).json(intake);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else if (req.query.issueId) {
		const intakes = await models.intake.findAll({ where: { issueId: req.query.issueId } , include: { all: true }});
		if (intakes.length) {
			res.status(200).json(intakes);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else if (req.query.issueNumber) {
		const intakes = await models.intake.findAll({ 
			where: 
				{ 
					'$issue.issue_number$': req.query.issueNumber 
				}, 
				include: { all: true, nested: true }
			});
		if (intakes.length) {
			res.status(200).json(intakes);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else if (req.query.intakeNumber) {
		const intake = await models.intake.findOne({ where: { intakeNumber: req.query.intakeNumber } , include: { all: true }});
		if (intake) {
			res.status(200).json(intake);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else getAll(req, res)
	
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		try {
			await sequelize.transaction(async (t) => {

				const persistedObj = await models.intake.create(req.body,
					{	
						transaction: t,
						include: [
							{ model: models.attachment }, 
							{ model: models.communicationLog },
							{ model: models.note }
						] 
					} );
				await models.intake.update({ intakeNumber: 'INTAKE-'+persistedObj.id }, {
					where: {
						id: persistedObj.id
					}, 
					transaction: t,
				});
				const intake = await models.intake.findByPk(persistedObj.id, 
					{ 
						include: { all: true },
						transaction: t,
					});
				res.status(201).json(intake.dataValues);
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
	const fieldsToExclude = ['id', 'applicationId', 'intakeNumber']; 
	return Object.keys(fullObj).filter( s => !fieldsToExclude.includes(s))
}

async function updateByApplicationId(req, res) {
	if (req.query.applicationId) { 
		await sequelize.transaction(async (t) => {
			const updatableFields = getUpdatableFields(req.body)
			try {
				const oldObj = await models.intake.findOne(
					{ 
						where: { 
							applicationId: req.query.applicationId 
						} , 
						include: { 
							all: true 
						},
						transaction: t,
					});
				if (oldObj) {		
					req.body.id = oldObj.id;
					const updatedRows = await models.intake.update(req.body, {
						where: {
							applicationId: req.query.applicationId
						},
						fields: updatableFields,
						transaction: t,
					});
					if (updatedRows[0] > 0) {
						await updateNotes(req, t);
						await updateCommunicationLogs(req, t);
						await updateAttachments(req, t);
						const updatedObj = await models.intake.findOne({ 
							where: { 
								applicationId: req.query.applicationId 
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

async function update(req, res) {
	try {
		const id = getIdParam(req);
		await sequelize.transaction(async (t) => {
			// We only accept an UPDATE request if the `:id` param matches the body `id`
			if (req.body.id === id) {
				const updatedRows = await models.intake.update(req.body, {
					where: {
						id: id
					},
					transaction: t
				});
				if (updatedRows[0] > 0) {
					await updateNotes(req, t);
					await updateCommunicationLogs(req, t);
					await updateAttachments(req, t);
					const updatedObj = await models.intake.findOne({ 
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

async function remove(req, res) {
	const id = getIdParam(req);
	await models.intake.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

async function updateNotes(req, t) {
	const id = req.body.id;
	const newNotes = req.body.notes || [];
		
	const newNotesIds = newNotes.map(note => note.id);
	const oldNotes = await models.note.findAll({
		where: {
			intakeId: id 
		},
		transaction: t,
	});
	const oldNotesIds = oldNotes.map(note => note.id)

	const deletedNotes = oldNotesIds.filter(x => !newNotesIds.includes(x));
	const addedNotes = newNotesIds.filter(x => !oldNotesIds.includes(x));
	const updatedNotes = newNotesIds.filter(x => oldNotesIds.includes(x));
	
	oldNotes.forEach(async n => {
		if (deletedNotes.includes(n.id)) {
			await models.note.destroy({
				where: {
					id: n.id
				},
				transaction: t,
			});
		}
	});
	newNotes.forEach(async n => {
		if (addedNotes.includes(n.id)) {
			n.intakeId = id;
			await models.note.create(n, {transaction: t});
		}
	});
	newNotes.forEach(async n => {
		if (updatedNotes.includes(n.id)) {
			n.intakeId = id;
			await models.note.update(n, {
				where: {
					id: n.id
				},
				transaction: t,
			});
		}
	});
}

async function updateAttachments(req, t) {
	const id = req.body.id;
	const newAttachments = req.body.attachments || [];
		
	const newAttachmentsIds = newAttachments.map(attachment => attachment.id);
	const oldAttachments = await models.attachment.findAll({
		where: {
			intakeId: id 
		},
		transaction: t,
	});
	const oldAttachmentsIds = oldAttachments.map(attachment => attachment.id)

	const deletedAttachments = oldAttachmentsIds.filter(x => !newAttachmentsIds.includes(x));
	const addedAttachments = newAttachmentsIds.filter(x => !oldAttachmentsIds.includes(x));
	const updatedAttachments = newAttachmentsIds.filter(x => oldAttachmentsIds.includes(x));
	
	oldAttachments.forEach(async n => {
		if (deletedAttachments.includes(n.id)) {
			await models.attachment.destroy({
				where: {
					id: n.id
				},
				transaction: t,
			});
		}
	});
	newAttachments.forEach(async n => {
		if (addedAttachments.includes(n.id)) {
			n.intakeId = id;
			await models.attachment.create(n, {transaction: t});
		}
	});
	newAttachments.forEach(async n => {
		if (updatedAttachments.includes(n.id)) {
			n.intakeId = id;
			await models.attachment.update(n, {
				where: {
					id: n.id
				},
				transaction: t,
			});
		}
	});
}

async function updateCommunicationLogs(req, t) {
	const id = req.body.id;
	const newCommunicationLogs = req.body.communicationLogs || [];
		
	const newCommunicationLogsIds = newCommunicationLogs.map(communicationLog => communicationLog.id);
	const oldCommunicationLogs = await models.communicationLog.findAll({
		where: {
			intakeId: id 
		},
		transaction: t,
	});
	const oldCommunicationLogsIds = oldCommunicationLogs.map(communicationLog => communicationLog.id)

	const deletedCommunicationLogs = oldCommunicationLogsIds.filter(x => !newCommunicationLogsIds.includes(x));
	const addedCommunicationLogs = newCommunicationLogsIds.filter(x => !oldCommunicationLogsIds.includes(x));
	const updatedCommunicationLogs = newCommunicationLogsIds.filter(x => oldCommunicationLogsIds.includes(x));
	
	oldCommunicationLogs.forEach(async n => {
		if (deletedCommunicationLogs.includes(n.id)) {
			await models.communicationLog.destroy({
				where: {
					id: n.id
				},
				transaction: t,
			});
		}
	});
	newCommunicationLogs.forEach(async n => {
		if (addedCommunicationLogs.includes(n.id)) {
			n.intakeId = id;
			await models.communicationLog.create(n, {transaction: t});
		}
	});
	newCommunicationLogs.forEach(async n => {
		if (updatedCommunicationLogs.includes(n.id)) {
			n.intakeId = id;
			await models.communicationLog.update(n, {
				where: {
					id: n.id
				},
				transaction: t,
			});
		}
	});
}

module.exports = {
	getAll,
	getById,
	getByQuery,
	create,
	update,
	updateByApplicationId,
	remove,
};
