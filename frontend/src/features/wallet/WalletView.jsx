import { useState, useEffect } from 'react';
import walletService from './walletService';
import userService from '../user/userService';

function WalletView({ onRefresh }) {
  const [wallet, setWallet] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('add');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchWallet(selectedUserId);
    } else {
      setLoading(false);
    }
  }, [selectedUserId, onRefresh]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Échec du chargement des utilisateurs');
    }
  };

  const fetchWallet = async (userId) => {
    try {
      setLoading(true);
      const response = await walletService.getWalletByUserId(userId);
      setWallet(response.data);
      setError('');
    } catch (err) {
      setWallet(null);
      setError('Portefeuille non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !amount) return;

    try {
      if (action === 'add') {
        await walletService.addFunds(selectedUserId, parseFloat(amount));
      } else {
        await walletService.deductFunds(selectedUserId, parseFloat(amount));
      }
      setAmount('');
      fetchWallet(selectedUserId);
    } catch (err) {
      alert(err.response?.data?.error || 'Opération échouée');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Portefeuille</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un utilisateur</label>
        <select
          value={selectedUserId || ''}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">-- Sélectionner un utilisateur --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email} ({user.fullName || 'Sans nom'})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">Chargement...</div>
      ) : wallet ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Solde</p>
            <p className="text-2xl font-bold text-green-600">
              {wallet.currency} {wallet.balance}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="add">Ajouter des fonds</option>
                <option value="deduct">Déduire des fonds</option>
              </select>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Montant"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p className="text-gray-500">{error || 'Sélectionnez un utilisateur pour voir le portefeuille'}</p>
      )}
    </div>
  );
}

export default WalletView;