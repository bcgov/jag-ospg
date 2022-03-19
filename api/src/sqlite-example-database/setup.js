const sequelize = require('../model');
const { pickRandom, randomDate } = require('./helpers/random');

const { 
	attachment, 
	category,
	communicationLog,
	contact,
	dispositionStatus,
	intakeStatus,
	intakeType,
	intake,
	issueCategory,
	issue,
	regulatoryBody,
	responseType,
	role,
	topic,
	user
} = sequelize.models;


async function reset() {
	console.log('Will rewrite the SQLite example database, adding some dummy data.');
	
	await sequelize.sync({ force: true });
	

	await sequelize.models.intakeStatus.bulkCreate([
		{ 
			intakeStatus: 1,
			isActive: true
		}
	]);
	
	await sequelize.models.intakeType.bulkCreate([
		{ 
			intakeType: 1,
			isActive: true
		}
	]);

	await sequelize.models.category.bulkCreate([
		{ 
			categoryName: 'category1',
			isActive: true
		},
		{ 
			categoryName: 'category2',
			isActive: true
		},
		{ 
			categoryName: 'category3',
			isActive: true
		},
	]);

	await sequelize.models.topic.bulkCreate([
		{ 
			topicName: 'topic1',
			isActive: true
		},
		{ 
			topicName: 'topic2',
			isActive: true
		},
		{ 
			topicName: 'topic3',
			isActive: true
		},
	]);

	await sequelize.models.issueStatus.bulkCreate([
		{ 
			issueStatus: 'issueStatus1',
			isActive: true
		},
		{ 
			issueStatus: 'issueStatus2',
			isActive: true
		},
		{ 
			issueStatus: 'issueStatus3',
			isActive: true
		},
	]);

	await sequelize.models.initialSource.bulkCreate([
		{ 
			initialSource: 'initialSource1',
			isActive: true
		},
		{ 
			initialSource: 'initialSource2',
			isActive: true
		},
		{ 
			initialSource: 'initialSource3',
			isActive: true
		},
	]);
	
	await sequelize.models.contact.bulkCreate([
		{ 

			firstName: 'Mickey',
			middleName: '',
			lastname: 'Mouse',
			phone: '778 123 4567',
			email: 'mmouse@disney.com',
			address: '123 Disney St.',
			city: 'Orlando',
			province: 'Florida',
			postalCode: '123456',
			isBusiness: false,
			notes: 'Notes...'
		}
	]);
	
	
	await sequelize.models.dispositionStatus.bulkCreate([
		{ 
			dispositionStatusName: 'dispositionStatus1',
			isActive: true
		},
		{ 
			dispositionStatusName: 'dispositionStatus2',
			isActive: true
		},
		{ 
			dispositionStatusName: 'dispositionStatus3',
			isActive: true
		},
	]);

	await sequelize.models.regulatoryBody.bulkCreate([
		{ 
			regulatoryBodyName: 'regulatoryBody1',
			isActive: true
		},
		{ 
			regulatoryBodyName: 'regulatoryBody2',
			isActive: true
		},
		{ 
			regulatoryBodyName: 'regulatoryBody3',
			isActive: true
		},
	]);

	await sequelize.models.responseType.bulkCreate([
		{ 
			responseType: 1,
			isActive: true
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

	await sequelize.models.issue.bulkCreate([
		{ 
			issueNumber: "ISSUE-1",
			applicationId: 3,
			applicationStatus: "Created",
			issueName: "test1",
			issueDescription: "test1",
			dateOpened: new Date(),
			issueDetails: null,
			assignedTo: null,
			statusId: 1,
			closureDate: null,
			dispositionStatusId: 1,
			topicId: 1,
			issueStatusId: 1,
			initialSourceId: 2,
		},
		{ 
			issueNumber: "ISSUE-2",
			applicationId: 5,
			applicationStatus: "Created",
			issueName: "test2",
			issueDescription: "test2",
			dateOpened: new Date(),
			issueDetails: null,
			assignedTo: null,
			statusId: 1,
			closureDate: null,
			dispositionStatusId: 1,
			topicId: 1,
			issueStatusId: 1,
			initialSourceId: 2,
		},
		{ 
			issueNumber: "ISSUE-3",
			applicationId: 7,
			applicationStatus: "Created",
			issueName: "test3",
			issueDescription: "test3",
			dateOpened: new Date(),
			issueDetails: null,
			assignedTo: null,
			statusId: 1,
			closureDate: null,
			dispositionStatusId: 1,
			topicId: 1,
			issueStatusId: 1,
			initialSourceId: 2,
		},
	]);

	await sequelize.models.intake.bulkCreate([
		{ 
			issueId: 1,
			intakeNumber: "INTAKE-1",
			applicationId: 100,
			applicationStatus: "Received",
			intakeTypeId: 1,
			dateReceived: new Date(),
			contactId: 1,
			details: 'Test details',
			responseTypeId: 1,
			dueDate: 1,
			resolution: 'Test resolution',
			intakeStatusId: 1,
			responseCompleteDate: new Date()
		}
	], {
		include: [ contact, responseType, intakeStatus, intakeType ]
	  });

	await sequelize.models.attachment.bulkCreate([
		{ 
			intakeId: 1,
			url: "https://bc.gov.ca/api/v1/files/test-567888-9876987-987688-876876.pdf?originalName=test.pdf",
			name: "test-567888-9876987-987688-876876.pdf",
			originalName: "test.pdf",
			size: 1024
		}
	]);

	await sequelize.models.attachment.bulkCreate([
		{ 
			intakeId: 1,
			dateAdded: new Date(),
			fileName: 'document2.doc',
			fileType: 'Contract'
		}
	]);

	await sequelize.models.issueCategory.bulkCreate([
		{ 
			issueId: 1,
			categoryId: 1
		}
	]);

	await sequelize.models.issueRegulatoryBody.bulkCreate([
		{ 
			issueId: 1,
			regulatoryBodyId: 1
		}
	]);
	await sequelize.models.note.bulkCreate([
		{ 
			intakeId: 1,
			body: 'Body... ',
			username: 'user1',
			id: "567888-9876987-987688-876876"
		}
	]);

	await sequelize.models.communicationLog.bulkCreate([
		{ 
			intakeId: 1,
			body: 'Body... ',
			username: 'user1',
			id: "567888-9876987-987688-876876"
		}
	]);
	

	console.log('Done!');
}

reset();
