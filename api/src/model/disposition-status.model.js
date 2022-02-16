const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('dispositionStatus', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dispositionStatus: {
            type: DataTypes.STRING,
            field: 'disposition_status'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        tableName: 'disposition_statuses',
        underscored: true,
        timestamps: false,
    });
};
