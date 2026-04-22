import api from '../../config/axios';

const transactionService = {
  getAllTransactions: () => api.get('/transactions'),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  getTransactionsByPaymentId: (paymentId) => api.get(`/transactions/payment/${paymentId}`),
  getTransactionsByAction: (action) => api.get(`/transactions/action/${action}`)
};

export default transactionService;