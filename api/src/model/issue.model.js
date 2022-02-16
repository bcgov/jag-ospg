const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('issue', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        issueNumber: {
            type: DataTypes.INTEGER,
            field: 'issue_number'
        },
        issueName: {
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
        assignedTo: {
            type: DataTypes.INTEGER,
            field: 'assigned_to'
        },
        statusId: {
            type: DataTypes.INTEGER,
            field: 'status_id'
        },
        closureDate: {
            type: DataTypes.DATE,
            field: 'closure_date'
        },
	},
    {
        underscored: true,
        timestamps: false,
    });
};
