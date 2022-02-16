const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('attachment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // intakeId: {
        //     type: DataTypes.INTEGER,
        //     field: 'intake_id'
        // },
        dateAdded: {
            type: DataTypes.DATE,
            field: 'date_added'
        },
        fileName: {
            type: DataTypes.STRING,
            field: 'file_name'
        },
        fileType: {
            type: DataTypes.STRING,
            field: 'file_type'
        }
	},
    {
        underscored: true,
        timestamps: false,
    });
};
