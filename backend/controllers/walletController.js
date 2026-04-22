const walletService = require('../services/walletService');

const walletController = {
  async getWalletByUserId(req, res) {
    try {
      const wallet = await walletService.getWalletByUserId(req.params.userId);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllWallets(req, res) {
    try {
      const wallets = await walletService.getAllWallets();
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async addFunds(req, res) {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      const wallet = await walletService.addFunds(req.params.userId, amount);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deductFunds(req, res) {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      const wallet = await walletService.deductFunds(req.params.userId, amount);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async transferFunds(req, res) {
    try {
      const { fromUserId, toUserId, amount } = req.body;
      if (!fromUserId || !toUserId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid parameters' });
      }
      const result = await walletService.transferFunds(fromUserId, toUserId, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = walletController;