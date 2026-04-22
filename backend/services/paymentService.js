const { Payment, User, Wallet, Transaction, WebhookLog } = require('../models');
const walletService = require('./walletService');
const webhookService = require('./webhookService');

const getRandomDelay = () => Math.floor(Math.random() * 3000) + 2000;
const isSuccess = () => Math.random() < 0.7;

const paymentService = {
  async createPayment(paymentData) {
    const { senderId, receiverId, amount, currency = 'USD', type = 'purchase', externalOrderRef } = paymentData;
    
    const senderWallet = await walletService.getWalletByUserId(senderId);
    if (!senderWallet) {
      throw new Error('Sender wallet not found. Please add funds to sender first.');
    }
    
    const receiverWallet = await walletService.getWalletByUserId(receiverId);
    if (!receiverWallet) {
      throw new Error('Receiver wallet not found');
    }
    
    const hasFunds = await walletService.hasSufficientFunds(senderId, amount);
    if (!hasFunds) {
      throw new Error('Insufficient funds');
    }
    
    const payment = await Payment.create({
      senderId,
      receiverId,
      amount,
      currency,
      type,
      status: 'pending',
      externalOrderRef
    });
    
    this.processPayment(payment.id);
    
    return payment;
  },

  async processPayment(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return;

    try {
      await payment.update({ status: 'processing' });

      await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

      const success = isSuccess();

      if (success) {
        await walletService.deductFunds(payment.senderId, payment.amount);
        await walletService.addFunds(payment.receiverId, payment.amount);
        
        await Transaction.create({
          paymentId: payment.id,
          action: 'debit',
          amount: payment.amount,
          description: `Payment #${payment.id} - Debit from sender`
        });
        
        await Transaction.create({
          paymentId: payment.id,
          action: 'credit',
          amount: payment.amount,
          description: `Payment #${payment.id} - Credit to receiver`
        });
        
        await payment.update({ status: 'completed' });
        await webhookService.triggerPaymentWebhook(payment, 'payment.completed');
        
      } else {
        await payment.update({ status: 'failed' });
        
        await Transaction.create({
          paymentId: payment.id,
          action: 'debit',
          amount: payment.amount,
          description: `Paiement #${payment.id} - Échoué (fonds insuffisants ou erreur)`
        });
        
        await webhookService.triggerPaymentWebhook(payment, 'payment.failed');
      }

    } catch (error) {
      console.error(`Payment processing error: ${error.message}`);
      await payment.update({ status: 'failed' });
    }
  },

  async getPaymentById(id) {
    return Payment.findByPk(id, {
      include: [
        { model: User, as: 'sender' },
        { model: User, as: 'receiver' },
        { model: Transaction, as: 'transactions' }
      ]
    });
  },

  async getAllPayments() {
    return Payment.findAll({
      include: [
        { model: User, as: 'sender' },
        { model: User, as: 'receiver' }
      ]
    });
  },

  async getPaymentsByUser(userId) {
    return Payment.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        { model: User, as: 'sender' },
        { model: User, as: 'receiver' }
      ]
    });
  },

  async getPaymentsByStatus(status) {
    return Payment.findAll({
      where: { status },
      include: [
        { model: User, as: 'sender' },
        { model: User, as: 'receiver' }
      ]
    });
  }
};

module.exports = paymentService;