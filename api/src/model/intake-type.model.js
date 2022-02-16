const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('intakeType', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        intakeType: {
            type: DataTypes.STRING,
            field: 'intake_type'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        tableName: 'intake_types',
        underscored: true,
        timestamps: false,
    });
};
