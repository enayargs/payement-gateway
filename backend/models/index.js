const { sequelize } = require('../config/database');
const User = require('./User');
const Wallet = require('./Wallet');
const Payment = require('./Payment');
const Transaction = require('./Transaction');
const WebhookLog = require('./WebhookLog');

User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Payment, { foreignKey: 'senderId', as: 'sentPayments' });
Payment.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Payment, { foreignKey: 'receiverId', as: 'receivedPayments' });
Payment.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Payment.hasMany(Transaction, { foreignKey: 'paymentId', as: 'transactions' });
Transaction.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

Payment.hasMany(WebhookLog, { foreignKey: 'paymentId', as: 'webhookLogs' });
WebhookLog.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

module.exports = {
  sequelize,
  User,
  Wallet,
  Payment,
  Transaction,
  WebhookLog
};