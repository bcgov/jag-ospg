const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('issueStatus', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        issueStatus: {
            type: DataTypes.STRING,
            field: 'issue_status'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        tableName: 'issue_statuses',
        underscored: true,
        timestamps: false,
    });
};
