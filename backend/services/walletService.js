const { Wallet, User } = require('../models');
const { Op } = require('sequelize');

const walletService = {
  async getWalletByUserId(userId) {
    return Wallet.findOne({
      where: { userId: parseInt(userId) },
      include: [{ model: User, as: 'user' }]
    });
  },

  async getAllWallets() {
    return Wallet.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['id', 'ASC']]
    });
  },

  async addFunds(userId, amount) {
    const wallet = await Wallet.findOne({ where: { userId: parseInt(userId) } });
    if (!wallet) return null;
    
    const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
    await wallet.update({ balance: newBalance });
    return wallet;
  },

  async deductFunds(userId, amount) {
    const wallet = await Wallet.findOne({ where: { userId: parseInt(userId) } });
    if (!wallet) return null;
    
    const currentBalance = parseFloat(wallet.balance);
    if (currentBalance < amount) {
      throw new Error('Insufficient funds');
    }
    
    const newBalance = currentBalance - parseFloat(amount);
    await wallet.update({ balance: newBalance });
    return wallet;
  },

  async hasSufficientFunds(userId, amount) {
    const wallet = await Wallet.findOne({ where: { userId: parseInt(userId) } });
    if (!wallet) return false;
    return parseFloat(wallet.balance) >= parseFloat(amount);
  },

  async transferFunds(fromUserId, toUserId, amount) {
    const fromWallet = await Wallet.findOne({ where: { userId: parseInt(fromUserId) } });
    const toWallet = await Wallet.findOne({ where: { userId: parseInt(toUserId) } });
    
    if (!fromWallet || !toWallet) {
      throw new Error('Wallet not found');
    }
    
    if (parseFloat(fromWallet.balance) < parseFloat(amount)) {
      throw new Error('Insufficient funds');
    }
    
    const fromNewBalance = parseFloat(fromWallet.balance) - parseFloat(amount);
    const toNewBalance = parseFloat(toWallet.balance) + parseFloat(amount);
    
    await fromWallet.update({ balance: fromNewBalance });
    await toWallet.update({ balance: toNewBalance });
    
    return { fromWallet, toWallet };
  }
};

module.exports = walletService;