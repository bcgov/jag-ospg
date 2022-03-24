const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('initialSource', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        initialSource: {
            type: DataTypes.STRING
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        tableName: 'initial_source',
        underscored: true,
        timestamps: false,
    });
};
