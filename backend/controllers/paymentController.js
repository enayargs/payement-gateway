const paymentService = require('../services/paymentService');

const paymentController = {
  async createPayment(req, res) {
    try {
      const payment = await paymentService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllPayments(req, res) {
    try {
      const payments = await paymentService.getAllPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentById(req, res) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentsByUser(req, res) {
    try {
      const payments = await paymentService.getPaymentsByUser(req.params.userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentsByStatus(req, res) {
    try {
      const payments = await paymentService.getPaymentsByStatus(req.params.status);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = paymentController;