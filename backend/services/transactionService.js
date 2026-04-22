const { Transaction, Payment } = require('../models');

const transactionService = {
  async getAllTransactions() {
    return Transaction.findAll({
      include: [{ model: Payment, as: 'payment' }]
    });
  },

  async getTransactionById(id) {
    return Transaction.findByPk(id, {
      include: [{ model: Payment, as: 'payment' }]
    });
  },

  async getTransactionsByPaymentId(paymentId) {
    return Transaction.findAll({
      where: { paymentId }
    });
  },

  async getTransactionsByAction(action) {
    return Transaction.findAll({
      where: { action },
      include: [{ model: Payment, as: 'payment' }]
    });
  },

  async createTransaction(transactionData) {
    return Transaction.create(transactionData);
  }
};

module.exports = transactionService;