import api from '../../config/axios';

const webhookService = {
  getAllWebhookLogs: () => api.get('/webhooks'),
  getWebhookLogById: (id) => api.get(`/webhooks/${id}`),
  getWebhookLogsByPaymentId: (paymentId) => api.get(`/webhooks/payment/${paymentId}`),
  getWebhookLogsBySentStatus: (sent) => api.get(`/webhooks/sent/${sent}`),
  retryWebhook: (id) => api.post(`/webhooks/${id}/retry`)
};

export default webhookService;