const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.get('/', webhookController.getAllWebhookLogs);
router.get('/payment/:paymentId', webhookController.getWebhookLogsByPaymentId);
router.get('/sent/:sent', webhookController.getWebhookLogsBySentStatus);
router.get('/:id', webhookController.getWebhookLogById);
router.post('/:id/retry', webhookController.retryWebhook);

module.exports = router;