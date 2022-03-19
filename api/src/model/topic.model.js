const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('topic', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        topicName: {
            type: DataTypes.STRING,
            field: 'topic_name'
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