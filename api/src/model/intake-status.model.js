const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('intakeStatus', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        intakeStatus: {
            type: DataTypes.STRING,
            field: 'intake_status'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        tableName: 'intake_statuses',
        underscored: true,
        timestamps: false,
    });
};
