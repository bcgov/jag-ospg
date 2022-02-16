const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('role', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        roleName: {
            type: DataTypes.STRING,
            field: 'role_name'
        }
	},
    {
        underscored: true,
        timestamps: false,
    });
};
