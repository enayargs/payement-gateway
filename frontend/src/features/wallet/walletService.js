import api from '../../config/axios';

const walletService = {
  getAllWallets: () => api.get('/wallets'),
  getWalletByUserId: (userId) => api.get(`/wallets/${userId}`),
  addFunds: (userId, amount) => api.post(`/wallets/${userId}/add`, { amount }),
  deductFunds: (userId, amount) => api.post(`/wallets/${userId}/deduct`, { amount }),
  transferFunds: (fromUserId, toUserId, amount) => api.post('/wallets/transfer', { fromUserId, toUserId, amount })
};

export default walletService;