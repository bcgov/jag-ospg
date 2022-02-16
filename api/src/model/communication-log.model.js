const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('communicationLog', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        issueId: {
            type: DataTypes.INTEGER,
            field: 'issue_id'
        },
        date: {
            type: DataTypes.DATE,
            field: 'date'
        },
        body: {
            type: DataTypes.STRING,
            field: 'body'
        }
	},
    {
        tableName: 'communication_logs',
        underscored: true,
        timestamps: false,
    });
};
