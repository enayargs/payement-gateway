import { useState, useEffect } from 'react';
import paymentService from './paymentService';
import userService from '../user/userService';

function PaymentForm({ onPaymentCreated }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    senderId: '',
    receiverId: '',
    amount: '',
    currency: 'USD',
    type: 'purchase',
    externalOrderRef: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Échec du chargement des utilisateurs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await paymentService.createPayment({
        ...formData,
        amount: parseFloat(formData.amount),
        senderId: parseInt(formData.senderId),
        receiverId: parseInt(formData.receiverId)
      });
      setSuccess(`Paiement créé ! ID: ${response.data.id} (Statut: ${response.data.status})`);
      setFormData({
        senderId: '',
        receiverId: '',
        amount: '',
        currency: 'USD',
        type: 'purchase',
        externalOrderRef: ''
      });
      if (onPaymentCreated) onPaymentCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Échec de la création du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Créer un paiement</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expéditeur</label>
            <select
              value={formData.senderId}
              onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">-- Sélectionner l'expéditeur --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} {user.wallet ? `(${user.wallet.balance} $)` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Destinataire</label>
            <select
              value={formData.receiverId}
              onChange={(e) => setFormData({ ...formData, receiverId: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">-- Sélectionner le destinataire --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Montant</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Devise</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="purchase">Achat</option>
              <option value="transfer">Transfert</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Référence commande externe (Optionnel)</label>
          <input
            type="text"
            value={formData.externalOrderRef}
            onChange={(e) => setFormData({ ...formData, externalOrderRef: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || formData.senderId === formData.receiverId}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Traitement...' : 'Créer le paiement'}
        </button>
        
        {formData.senderId === formData.receiverId && formData.senderId && (
          <p className="text-red-500 text-sm text-center">L'expéditeur et le destinataire doivent être différents</p>
        )}
      </form>
    </div>
  );
}

export default PaymentForm;