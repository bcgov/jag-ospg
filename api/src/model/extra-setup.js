function applyExtraSetup(sequelize) {
	const { 
		attachment, 
		category,
		communicationLog,
		contact,
		dispositionStatus,
		intakeStatus,
		intakeType,
		intake,
		issue,
		regulatoryBody,
		responseType,
		role,
		user
	} = sequelize.models;


	// intake realtionships
	intake.hasMany(attachment)
	attachment.belongsTo(intake)
	
	contact.hasOne(intake)
	intake.belongsTo(contact)

	issue.hasOne(intake)
	intake.belongsTo(issue)

	intakeType.hasOne(intake)
	intake.belongsTo(intakeType)

	responseType.hasOne(intake)
	intake.belongsTo(responseType)

	intakeStatus.hasOne(intake)
	intake.belongsTo(intakeStatus)

	// user relationships
	role.hasOne(user)
	user.belongsTo(role)

	// issue x category
	issue.belongsToMany(category, { through: 'issueCategory' });
	category.belongsToMany(issue, { through: 'issueCategory' });

	// issue x category
	issue.belongsToMany(regulatoryBody, { through: 'issueRegulatoryBody' });
	regulatoryBody.belongsToMany(issue, { through: 'issueRegulatoryBody' });

	dispositionStatus.hasOne(issue)
	issue.belongsTo(dispositionStatus)

}

module.exports = { applyExtraSetup };
