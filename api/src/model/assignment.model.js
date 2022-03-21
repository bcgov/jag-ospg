const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('assignment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        assignment: {
            type: DataTypes.STRING
        },
        isActive: {
            type: DataTypes.BOOLEAN
        }
	},
    {
        underscored: true,
        timestamps: false,
    });
};
