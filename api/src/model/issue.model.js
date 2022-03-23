const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	const Issue = sequelize.define('issue', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        issueNumber: {
            type: DataTypes.STRING,
            field: 'issue_number'
        },
        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                isUnique: function(value, next) {
                    Issue.findOne({
                        where: {applicationId: value},
                        attributes: ['applicationId']
                    })
                    .then(function(issue) {
                        if (issue && this.isNewRecord)
                            return next('ApplicationId already in use!');
                        next();
                    });
                }
            }
        },
        applicationStatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        issueName: {
            type: DataTypes.STRING,
            field: 'issue_name'
        },
        issueDescription: {
            type: DataTypes.STRING,
            field: 'issue_name'
        },
        dateOpened: {
            type: DataTypes.DATE,
            field: 'date_opened'
        },
        issueDetails: {
            type: DataTypes.STRING,
            field: 'issue_details'
        },
        closureDate: {
            type: DataTypes.DATE,
            field: 'closure_date'
        },
        isCompliant: {
            type: DataTypes.BOOLEAN
        },
        isWithinOspgJurisdiction: {
            type: DataTypes.BOOLEAN
        },
	},
    {
        underscored: true,
        timestamps: false,
    });
};
