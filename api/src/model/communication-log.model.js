const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('communicationLog', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING
        },
        body: {
            type: DataTypes.STRING
        },
        from: {
            type: DataTypes.STRING,
            field: 'username'
        }
	},
    {
        tableName: 'communication_logs',
        underscored: true,
        timestamps: true,
        updatedAt: false,
        createdAt: 'receivedAt'
    });
};
