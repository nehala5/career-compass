const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'notification_id',
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'receiver_id',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'message',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'timestamp',
    },
    status: {
      type: DataTypes.ENUM('READ', 'UNREAD'),
      allowNull: true,
      defaultValue: 'UNREAD',
      field: 'status',
    },
  }, {
    timestamps: false,
    tableName: 'notifications',
  });

  return Notification;
};