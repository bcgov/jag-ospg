const Sequelize = require('sequelize');
const sequelize = require('../model');
const { pickRandom, randomDate } = require('./helpers/random');

const { 
	assignment,
	attachment, 
	category,
	communicationLog,
	contact,
	dispositionStatus,
	intakeStatus,
	intakeType,
	intake,
	issueStatus,
	issue,
	regulatoryBody,
	responseType,
	role,
	topic,
	user
} = sequelize.models;


async function reset() {
	console.log('Will rewrite the SQLite example database, adding some dummy data.');
	
	try{ 

		await sequelize.sync({ force: true });
		
		await sequelize.models.assignment.bulkCreate([
			{ 
				assignment: 'Staff',
				isActive: true
			},
			{ 
				assignment: 'Management',
				isActive: true
			},
			{ 
				assignment: 'Inactive',
				isActive: false
			}
		]);

		await sequelize.models.intakeStatus.bulkCreate([
			{ 
				intakeStatus: 'New',
				isActive: true
			},
			{ 
				intakeStatus: 'In Progress',
				isActive: true
			},
			{ 
				intakeStatus: 'Closed',
				isActive: true
			},
			{ 
				intakeStatus: 'Inactive',
				isActive: false
			}
		]);
		
		await sequelize.models.intakeType.bulkCreate([
			{ 
				intakeType: 'intakeType1',
				isActive: true
			},
			{ 
				intakeType: 'intakeType2',
				isActive: true
			},
			{ 
				intakeType: 'intakeType3',
				isActive: true
			},
			{ 
				intakeType: 'Inactive',
				isActive: false
			}
		]);

		await sequelize.models.category.bulkCreate([
			{ 
				categoryName: 'Reg Body Operations',
				isActive: true
			},
			{ 
				categoryName: 'Reg Body Designation',
				isActive: true
			},
			{ 
				categoryName: 'State of Profession',
				isActive: true
			},
			{ 
				categoryName: 'Engagement',
				isActive: true
			},
			{ 
				categoryName: 'Prof Gov Best Practices',
				isActive: true
			},
			{ 
				categoryName: 'Inactive',
				isActive: false
			}
		]);

		await sequelize.models.topic.bulkCreate([
			{ 
				topicName: 'Transparency and Accountability',
				isActive: true
			},
			{ 
				topicName: 'Standards of Conduct and Competence',
				isActive: true
			},
			{ 
				topicName: 'Continuing competence and CEP',
				isActive: true
			},
			{ 
				topicName: 'Registration',
				isActive: true
			},
			{ 
				topicName: 'Audit and Practice Reviews',
				isActive: true
			},
			{ 
				topicName: 'Complaints and Discipline',
				isActive: true
			},
			{ 
				topicName: 'Duty to Report and Reprisals',
				isActive: true
			},
			{ 
				topicName: 'Firm Regulation',
				isActive: true
			},
			{ 
				topicName: 'Advocacy',
				isActive: true
			},
			{ 
				topicName: 'OSPG Audits and Investigations',
				isActive: true
			},
			{ 
				topicName: 'Register/Info Publicly Available',
				isActive: true
			},
			{ 
				topicName: 'Practice Rights',
				isActive: true
			},
			{ 
				topicName: 'Declarations',
				isActive: true
			},
			{ 
				topicName: 'Sewerage Systems',
				isActive: true
			},
			{ 
				topicName: 'Inactive',
				isActive: false
			}
		]);

		await sequelize.models.issueStatus.bulkCreate([
			{ 
				issueStatus: 'New',
				isActive: true
			},
			{ 
				issueStatus: 'In Progress',
				isActive: true
			},
			{ 
				issueStatus: 'Closed',
				isActive: true
			},
			{ 
				issueStatus: 'Inactive',
				isActive: false
			}
		]);

		await sequelize.models.initialSource.bulkCreate([
			{ 
				initialSource: 'OSPG Inbox',
				isActive: true
			},
			{ 
				initialSource: 'OSPG Phone',
				isActive: true
			},
			{ 
				initialSource: 'Ministers Office - CCU',
				isActive: true
			},
			{ 
				initialSource: 'Superintendent Direct',
				isActive: true
			},
			{ 
				initialSource: 'Staff Direct',
				isActive: true
			},
			{ 
				initialSource: 'Inactive',
				isActive: false
			}
		]);
		
		await sequelize.models.contact.bulkCreate([
			{ 
				firstName: 'Mickey',
				middleName: '',
				lastName: 'Mouse',
				phone: '778 123 4567',
				email: 'mmouse@disney.com',
				address: '123 Disney St.',
				city: 'Orlando',
				province: 'Florida',
				postalCode: '123456',
				isBusiness: false,
				notes: 'Notes...',
				isActive: true
			},
			{ 
				firstName: 'Minnie',
				middleName: '',
				lastName: 'Mouse',
				phone: '778 123 4568',
				email: 'minnie.mouse@disney.com',
				address: '123 Disney St.',
				city: 'Orlando',
				province: 'Florida',
				postalCode: '123456',
				isBusiness: false,
				notes: 'Notes...',
				isActive: true
			},
			{ 
				firstName: 'Inactive',
				middleName: '',
				lastName: 'Inactive',
				phone: '778 123 4568',
				email: 'Inactive@Inactive.com',
				address: '123 Disney St.',
				city: 'Inactive',
				province: 'Inactive',
				postalCode: '123456',
				isBusiness: false,
				notes: 'Notes...Inactive',
				isActive: false
			},
		]);
		
		await sequelize.models.dispositionStatus.bulkCreate([
			{ 
				dispositionStatus: 'Refer to another body',
				isActive: true
			},
			{ 
				dispositionStatus: 'Refer to OSPG Audit',
				isActive: true
			},
			{ 
				dispositionStatus: 'Information Response',
				isActive: true
			},
			{ 
				dispositionStatus: 'Early Resolution Response',
				isActive: true
			},
			{ 
				dispositionStatus: 'Refer to OSPG Investigation',
				isActive: true
			},
			{ 
				dispositionStatus: 'Inactive',
				isActive: false
			}
		]);

		await sequelize.models.regulatoryBody.bulkCreate([
			{ 
				regulatoryBodyName: 'ABCFP',
				isActive: true
			},
			{ 
				regulatoryBodyName: 'AIBC',
				isActive: true
			},
			{ 
				regulatoryBodyName: 'ASTTBC',
				isActive: true
			},
			{ 
				regulatoryBodyName: 'BCIA',
				isActive: true
			},{ 
				regulatoryBodyName: 'CAB',
				isActive: true
			},
			{ 
				regulatoryBodyName: 'EGBC',
				isActive: true
			},
			{ 
				regulatoryBodyName: 'Inactive',
				isActive: false
			}
		]);

		await sequelize.models.responseType.bulkCreate([
			{ 
				responseType: 'responseType1',
				isActive: true
			},
			{ 
				responseType: 'responseType1',
				isActive: true
			},
			{ 
				responseType: 'responseType1',
				isActive: true
			},
			{ 
				responseType: 'Inactive',
				isActive: false
			}
		]);
		
		await sequelize.models.role.bulkCreate([
			{ 
				roleName: 'Manager'
			}
		]);

		await sequelize.models.user.bulkCreate([
			{ 
				idir: 'jack-sparrow',
				dateAdded: new Date(),
				roleId: 1
			},
			{ 
				idir: 'white-beard',
				dateAdded: new Date(),
				roleId: 1
			},
			{ 
				idir: 'black-beard',
				dateAdded: new Date(),
				roleId: 1
			},
			{ 
				idir: 'brown-beard',
				dateAdded: new Date(),
				roleId: 1
			},
		]);

		// await sequelize.models.issue.bulkCreate([
		// 	{ 
		// 		issueNumber: "ISSUE-1",
		// 		applicationId: 3,
		// 		applicationStatus: "Created",
		// 		issueName: "test1",
		// 		issueDescription: "test1",
		// 		dateOpened: new Date(),
		// 		issueDetails: null,
		// 		assignmentId: 1,
		// 		statusId: 1,
		// 		closureDate: null,
		// 		dispositionStatusId: 1,
		// 		topicId: 1,
		// 		issueStatusId: 1,
		// 		initialSourceId: 2,
		// 		categoryId: 1
		// 	},
		// 	{ 
		// 		issueNumber: "ISSUE-2",
		// 		applicationId: 5,
		// 		applicationStatus: "Created",
		// 		issueName: "test2",
		// 		issueDescription: "test2",
		// 		dateOpened: new Date(),
		// 		issueDetails: null,
		// 		assignmentId: 1,
		// 		statusId: 1,
		// 		closureDate: null,
		// 		dispositionStatusId: 1,
		// 		topicId: 1,
		// 		issueStatusId: 1,
		// 		initialSourceId: 2,
		// 		categoryId: 2
		// 	},
		// 	{ 
		// 		issueNumber: "ISSUE-3",
		// 		applicationId: 7,
		// 		applicationStatus: "Created",
		// 		issueName: "test3",
		// 		issueDescription: "test3",
		// 		dateOpened: new Date(),
		// 		issueDetails: null,
		// 		assignmentId: 1,
		// 		statusId: 1,
		// 		closureDate: null,
		// 		dispositionStatusId: 1,
		// 		topicId: 1,
		// 		issueStatusId: 1,
		// 		initialSourceId: 2,
		// 		categoryId: 3
		// 	},
		// ]);

		// await sequelize.models.intake.bulkCreate([
		// 	{ 
		// 		issueId: 1,
		// 		intakeNumber: "INTAKE-1",
		// 		applicationId: 100,
		// 		applicationStatus: "Received",
		// 		intakeTypeId: 1,
		// 		intakeTitle: "Intake Title",
		// 		dateReceived: new Date(),
		// 		contactId: 1,
		// 		details: 'Test details',
		// 		responseTypeId: 1,
		// 		dueDate: 1,
		// 		resolution: 'Test resolution',
		// 		intakeStatusId: 1,
		// 		responseCompleteDate: new Date(),
		// 		staffAssignedTo: "John Doe",
		// 		mgmtAssignedTo: "Mary Manager"
		// 	},
		// 	{ 
		// 		issueId: 1,
		// 		intakeNumber: "INTAKE-2",
		// 		applicationId: 150,
		// 		applicationStatus: "Received",
		// 		intakeTypeId: 1,
		// 		dateReceived: new Date(),
		// 		contactId: 1,
		// 		details: 'Test details',
		// 		responseTypeId: 1,
		// 		dueDate: 1,
		// 		resolution: 'Test resolution',
		// 		intakeStatusId: 1,
		// 		responseCompleteDate: new Date(),
		// 		staffAssignedTo: "John Doe",
		// 		mgmtAssignedTo: "Mary Manager"
		// 	},
		// 	{ 
		// 		issueId: 2,
		// 		intakeNumber: "INTAKE-3",
		// 		applicationId: 200,
		// 		applicationStatus: "Received",
		// 		intakeTypeId: 2,
		// 		dateReceived: new Date(),
		// 		contactId: 1,
		// 		details: 'Test details',
		// 		responseTypeId: 1,
		// 		dueDate: 1,
		// 		resolution: 'Test resolution',
		// 		intakeStatusId: 1,
		// 		responseCompleteDate: new Date(),
		// 		staffAssignedTo: "John Doe",
		// 		mgmtAssignedTo: "Mary Manager"
		// 	}
		// ], {
		// 	include: [ contact, responseType, intakeStatus, intakeType ]
		// });

		// await sequelize.models.attachment.bulkCreate([
		// 	{ 
		// 		intakeId: 1,
		// 		url: "https://bc.gov.ca/api/v1/files/test-567888-9876987-987688-876876.pdf?originalName=test.pdf",
		// 		name: "test-567888-9876987-987688-876876.pdf",
		// 		originalName: "test.pdf",
		// 		size: 1024
		// 	}
		// ]);

		// await sequelize.models.attachment.bulkCreate([
		// 	{ 
		// 		intakeId: 1,
		// 		dateAdded: new Date(),
		// 		fileName: 'document2.doc',
		// 		fileType: 'Contract'
		// 	}
		// ]);


		// await sequelize.models.issueRegulatoryBody.bulkCreate([
		// 	{ 
		// 		issueId: 1,
		// 		regulatoryBodyId: 1
		// 	}
		// ]);
		// await sequelize.models.note.bulkCreate([
		// 	{ 
		// 		intakeId: 1,
		// 		body: 'Body... ',
		// 		username: 'user1',
		// 		id: "567888-9876987-987688-876876"
		// 	},
		// 	{ 
		// 		intakeId: 2,
		// 		body: 'Body2... ',
		// 		username: 'user2',
		// 		id: "567888-9876987-987688-87333"
		// 	}
		// ]);

		// await sequelize.models.communicationLog.bulkCreate([
		// 	{ 
		// 		intakeId: 1,
		// 		subject: 'Subject',
		// 		body: 'Body... ',
		// 		from: 'User Test',
		// 		id: "567888-9876987-987688-99999"
		// 	},
		// 	{ 
		// 		intakeId: 2,
		// 		subject: 'Subject2',
		// 		body: 'Body2... ',
		// 		from: 'User Test',
		// 		id: "567888-9876987-987688-93339"
		// 	}
		// ]);
	} catch (e) {
		if (e instanceof Sequelize.ValidationError) {
			console.log(e.errors);
		} else {
			console.log(e.message);
		}
	}

	console.log('Done!');
}

reset();
