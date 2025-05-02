const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Placement = sequelize.define('Placement', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        application_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected'),
            allowNull: true
        },
        package: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'placements',
        timestamps: false
    });

    return Placement;
};