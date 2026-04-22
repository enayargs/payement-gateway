const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/user/:userId', paymentController.getPaymentsByUser);
router.get('/status/:status', paymentController.getPaymentsByStatus);
router.get('/:id', paymentController.getPaymentById);

module.exports = router;