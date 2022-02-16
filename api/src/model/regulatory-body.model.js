const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('regulatoryBody', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        regulatoryBodyName: {
            type: DataTypes.STRING,
            field: 'regulatoty_body_name'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        tableName: 'regulatory_bodies',
        underscored: true,
        timestamps: false,
    });
};
