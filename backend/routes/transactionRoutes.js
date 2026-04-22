const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.getAllTransactions);
router.get('/payment/:paymentId', transactionController.getTransactionsByPaymentId);
router.get('/action/:action', transactionController.getTransactionsByAction);
router.get('/:id', transactionController.getTransactionById);

module.exports = router;