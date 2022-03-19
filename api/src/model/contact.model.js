const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('contact', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        contactType: {
            type: DataTypes.INTEGER,
        },
        firstName: {
            type: DataTypes.STRING
        },
        middleName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING,
        },
        email:{
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        province: {
            type: DataTypes.STRING,
        },
        postalCode: {
            type: DataTypes.STRING,
        },
        notes: {
            type: DataTypes.STRING,

        },
        isBusiness: {
            type: DataTypes.BOOLEAN
        }

	},
    {
        underscored: true,
        timestamps: true,
        updatedAt: false,
        createdAt: 'dateAdded' 
    });
};
