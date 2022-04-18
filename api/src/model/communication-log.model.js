const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('communicationLog', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING(100)
        },
        body: {
            type: DataTypes.STRING(4000)
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
