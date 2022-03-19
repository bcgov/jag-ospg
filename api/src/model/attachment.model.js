const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('attachment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING,
            field: 'file_name'
        },
        originalName: {
            type: DataTypes.STRING,
            field: 'original_name'
        },
        size: {
            type: DataTypes.INTEGER
        }
	},
    {
        underscored: true,
        timestamps: true,
        updatedAt: false,
        createdAt: 'dateAdded' 
    });
};
