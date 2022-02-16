const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('contact', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dateAdded: {
            type: DataTypes.DATE,
            field: 'date_added'
        },
        contactType: {
            type: DataTypes.INTEGER,
            field: 'contact_type'
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        phone: {
            type: DataTypes.STRING,
            field: 'phone'
        },
        address: {
            type: DataTypes.STRING,
            field: 'address'
        },
        notes: {
            type: DataTypes.STRING,
            field: 'notes'
        }
	},
    {
        underscored: true,
        timestamps: false,
    });
};
