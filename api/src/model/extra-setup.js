function applyExtraSetup(sequelize) {
	const { 
		attachment, 
		category,
		communicationLog,
		contact,
		dispositionStatus,
		initialSource,
		intakeStatus,
		intakeType,
		intake,
		issueCategory,
		issueRegulatoryBody,
		issueStatus,
		issue,
		note,
		regulatoryBody,
		responseType,
		role,
		topic,
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

	intake.hasMany(note)
	note.belongsTo(intake)

	intake.hasMany(communicationLog)
	communicationLog.belongsTo(intake)

	// user relationships
	role.hasOne(user)
	user.belongsTo(role)

	// issue x category
	issue.hasMany(issueCategory);
	issueCategory.belongsTo(issue);

	category.hasMany(issueCategory);
	issueCategory.belongsTo(category);

	issue.hasMany(issueRegulatoryBody);
	issueRegulatoryBody.belongsTo(issue);

	regulatoryBody.hasMany(issueRegulatoryBody);
	issueRegulatoryBody.belongsTo(regulatoryBody);

	// issue.belongsToMany(category, 
	// 	{ 
	// 		through: 'issueCategory',
	// 		as: 'issueCategoryAssociation'
	// 	});
	// category.belongsToMany(issue, 
	// 	{ 
	// 		through: 'issueCategory',
	// 		as: 'categoryIssueAssociation' 
	// 	});

	// // issue x regulatoryBody
	// issue.belongsToMany(regulatoryBody, 
	// 	{ 
	// 		through: 'issueRegulatoryBody',
	// 		as: 'issueRegulatoryBodyAssociation' 
	// 	});
	// regulatoryBody.belongsToMany(issue, 
	// 	{ 
	// 		through: 'issueRegulatoryBody',
	// 		as: 'regulatoryBodyIssueAssociation'
	// 	});



	dispositionStatus.hasOne(issue)
	issue.belongsTo(dispositionStatus)

	topic.hasOne(issue)
	issue.belongsTo(topic)

	issueStatus.hasOne(issue)
	issue.belongsTo(issueStatus)


	initialSource.hasMany(issue)
	issue.belongsTo(initialSource)
}

module.exports = { applyExtraSetup };
