const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('issueRegulatoryBody', {
        issueId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        regulatoryBodyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        }, 
	},
    {
        tableName: 'issue_regulatory_body',
        underscored: true,
        timestamps: false,
    });
};
