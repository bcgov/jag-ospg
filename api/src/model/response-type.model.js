const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('responseType', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        responseType: {
            type: DataTypes.STRING,
            field: 'response_type'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        tableName: 'response_types',
        underscored: true,
        timestamps: false,
    });
};
