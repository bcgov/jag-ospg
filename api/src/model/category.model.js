const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categoryName: {
            type: DataTypes.STRING,
            field: 'category_name'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        underscored: true,
        timestamps: false,
    });
};
