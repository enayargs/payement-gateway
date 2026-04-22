const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/', walletController.getAllWallets);
router.post('/transfer', walletController.transferFunds);
router.post('/:userId/add', walletController.addFunds);
router.post('/:userId/deduct', walletController.deductFunds);
router.get('/:userId', walletController.getWalletByUserId);

module.exports = router;