import api from '../../config/axios';

const paymentService = {
  getAllPayments: () => api.get('/payments'),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  getPaymentsByUser: (userId) => api.get(`/payments/user/${userId}`),
  getPaymentsByStatus: (status) => api.get(`/payments/status/${status}`),
  createPayment: (data) => api.post('/payments', data)
};

export default paymentService;