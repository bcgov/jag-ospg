const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('intake', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dateReceived: {
            type: DataTypes.DATE,
            field: 'date_received'
        },

        details: {
            type: DataTypes.STRING,
            field: 'details'
        },
        dueDate: {
            type: DataTypes.DATE,
            field: 'due_date'
        },
        resolution: {
            type: DataTypes.STRING,
            field: 'resolution'
        },
        responseCompleteDate: {
            type: DataTypes.DATE,
            field: 'response_complete_date'
        },
	},
    {
        underscored: true,
        timestamps: false,
    });
};
