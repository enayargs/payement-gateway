const webhookService = require('../services/webhookService');

const webhookController = {
  async getAllWebhookLogs(req, res) {
    try {
      const webhookLogs = await webhookService.getAllWebhookLogs();
      res.json(webhookLogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getWebhookLogById(req, res) {
    try {
      const webhookLog = await webhookService.getWebhookLogById(req.params.id);
      if (!webhookLog) {
        return res.status(404).json({ error: 'Webhook log not found' });
      }
      res.json(webhookLog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getWebhookLogsByPaymentId(req, res) {
    try {
      const webhookLogs = await webhookService.getWebhookLogsByPaymentId(req.params.paymentId);
      res.json(webhookLogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getWebhookLogsBySentStatus(req, res) {
    try {
      const sent = req.params.sent === 'true';
      const webhookLogs = await webhookService.getWebhookLogsBySentStatus(sent);
      res.json(webhookLogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async retryWebhook(req, res) {
    try {
      const webhookLog = await webhookService.retryWebhook(req.params.id);
      if (!webhookLog) {
        return res.status(404).json({ error: 'Webhook log not found' });
      }
      res.json(webhookLog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = webhookController;