const { WebhookLog, Payment } = require('../models');

const webhookService = {
  async triggerPaymentWebhook(payment, eventType) {
    const payload = {
      event: eventType,
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      senderId: payment.senderId,
      receiverId: payment.receiverId,
      type: payment.type,
      createdAt: payment.createdAt
    };

    const responseCode = Math.random() < 0.8 ? 200 : 500;
    const sent = responseCode === 200;

    const webhookLog = await WebhookLog.create({
      paymentId: payment.id,
      eventType,
      payload,
      responseCode,
      sent
    });

    return webhookLog;
  },

  async getAllWebhookLogs() {
    return WebhookLog.findAll({
      include: [{ model: Payment, as: 'payment' }]
    });
  },

  async getWebhookLogById(id) {
    return WebhookLog.findByPk(id, {
      include: [{ model: Payment, as: 'payment' }]
    });
  },

  async getWebhookLogsByPaymentId(paymentId) {
    return WebhookLog.findAll({
      where: { paymentId }
    });
  },

  async getWebhookLogsBySentStatus(sent) {
    return WebhookLog.findAll({
      where: { sent }
    });
  },

  async retryWebhook(webhookLogId) {
    const webhookLog = await WebhookLog.findByPk(webhookLogId);
    if (!webhookLog) return null;

    const responseCode = Math.random() < 0.9 ? 200 : 500;
    const sent = responseCode === 200;

    await webhookLog.update({ responseCode, sent });
    return webhookLog;
  }
};

module.exports = webhookService;