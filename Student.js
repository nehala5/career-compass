const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Student = sequelize.define('Student', {
        student_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        department: {
            type: DataTypes.ENUM('CSE', 'IT', 'ECE', 'EEE', 'ME'),
            allowNull: false
        },
        graduation_year: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        skills: {
            type: DataTypes.STRING,
            allowNull: true
        },
        branch: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'students',
        timestamps: false
    });

    return Student;
};