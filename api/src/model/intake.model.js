const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	const Intake = sequelize.define('intake', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        intakeNumber: {
            type: DataTypes.STRING
        },
        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                isUnique: function(value, next) {
                    Intake.findOne({
                        where: {applicationId: value},
                        attributes: ['applicationId']
                    })
                    .then(function(intake) {
                        if (intake && this.isNewRecord)
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
        intakeTitle: {
            type: DataTypes.STRING
        },
        staffAssignedTo: {
            type: DataTypes.STRING
        },
        mgmtAssignedTo: {
            type: DataTypes.STRING
        },
        dateReceived: {
            type: DataTypes.DATE,
            field: 'date_received'
        },

        details: {
            type: DataTypes.STRING,
            field: 'details'
        },
        dueDate: {
            type: DataTypes.DATE,
            field: 'due_date'
        },
        resolution: {
            type: DataTypes.STRING,
            field: 'resolution'
        },
        responseCompleteDate: {
            type: DataTypes.DATE,
            field: 'response_complete_date'
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
