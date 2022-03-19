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
		const t = await sequelize.transaction();
		const updatableFields = getUpdatableFields(req.body)
		try {
			const oldObj = await models.intake.findOne(
				{ 
					where: { 
						applicationId: req.query.applicationId 
					} , 
					include: { 
						all: true 
					}
				});
			req.body.id = oldObj.id;
			const updatedRows = await models.intake.update(req.body, {
				where: {
					applicationId: req.query.applicationId
				},
				fields: updatableFields
			});
			if (updatedRows[0] > 0) {
				await updateNotes(req);
				await updateCommunicationLogs(req);
				await updateAttachments(req);
				const updatedObj = await models.intake.findOne({ where: { applicationId: req.query.applicationId } , include: { all: true }});
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
	} else {
		res.status(400).send(`Bad request: applicationId query required.`);
	}
}

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.intake.update(req.body, {
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
	await models.intake.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

async function updateNotes(req) {
	const id = req.body.id;
	const newNotes = req.body.notes || [];
		
	const newNotesIds = newNotes.map(note => note.id);
	const oldNotes = await models.note.findAll({
		where: {
			intakeId: id 
		}
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
				}
			});
		}
	});
	newNotes.forEach(async n => {
		if (addedNotes.includes(n.id)) {
			n.intakeId = id;
			await models.note.create(n);
		}
	});
	newNotes.forEach(async n => {
		if (updatedNotes.includes(n.id)) {
			n.intakeId = id;
			await models.note.update(n, {
				where: {
					id: n.id
				}
			});
		}
	});
}

async function updateAttachments(req) {
	const id = req.body.id;
	const newAttachments = req.body.attachments || [];
		
	const newAttachmentsIds = newAttachments.map(attachment => attachment.id);
	const oldAttachments = await models.attachment.findAll({
		where: {
			intakeId: id 
		}
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
				}
			});
		}
	});
	newAttachments.forEach(async n => {
		if (addedAttachments.includes(n.id)) {
			n.intakeId = id;
			await models.attachment.create(n);
		}
	});
	newAttachments.forEach(async n => {
		if (updatedAttachments.includes(n.id)) {
			n.intakeId = id;
			await models.attachment.update(n, {
				where: {
					id: n.id
				}
			});
		}
	});
}

async function updateCommunicationLogs(req) {
	const id = req.body.id;
	const newCommunicationLogs = req.body.communicationLogs || [];
		
	const newCommunicationLogsIds = newCommunicationLogs.map(communicationLog => communicationLog.id);
	const oldCommunicationLogs = await models.communicationLog.findAll({
		where: {
			intakeId: id 
		}
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
				}
			});
		}
	});
	newCommunicationLogs.forEach(async n => {
		if (addedCommunicationLogs.includes(n.id)) {
			n.intakeId = id;
			await models.communicationLog.create(n);
		}
	});
	newCommunicationLogs.forEach(async n => {
		if (updatedCommunicationLogs.includes(n.id)) {
			n.intakeId = id;
			await models.communicationLog.update(n, {
				where: {
					id: n.id
				}
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
