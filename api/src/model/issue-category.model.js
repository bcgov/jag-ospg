const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('issueCategory', {
        issueId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        }, 
	},
    {
        tableName: 'issue_category',
        underscored: true,
        timestamps: false,
    });
};
