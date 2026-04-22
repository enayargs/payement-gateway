const transactionService = require('../services/transactionService');

const transactionController = {
  async getAllTransactions(req, res) {
    try {
      const transactions = await transactionService.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTransactionById(req, res) {
    try {
      const transaction = await transactionService.getTransactionById(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTransactionsByPaymentId(req, res) {
    try {
      const transactions = await transactionService.getTransactionsByPaymentId(req.params.paymentId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTransactionsByAction(req, res) {
    try {
      const { action } = req.params;
      if (!['debit', 'credit'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action. Use "debit" or "credit"' });
      }
      const transactions = await transactionService.getTransactionsByAction(action);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = transactionController;