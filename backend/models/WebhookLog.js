const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WebhookLog = sequelize.define('WebhookLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'paymentId'
  },
  eventType: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: true
  },
  responseCode: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'webhook_logs',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = WebhookLog;