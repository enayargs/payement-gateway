import { useState } from 'react';
import CreateUser from './features/user/CreateUser';
import UserList from './features/user/UserList';
import WalletView from './features/wallet/WalletView';
import PaymentForm from './features/payment/PaymentForm';
import PaymentHistory from './features/payment/PaymentHistory';
import TransactionList from './features/transaction/TransactionList';
import WebhookLogs from './features/webhook/WebhookLogs';

function App() {
  const [activeTab, setActiveTab] = useState('users');
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const tabs = [
    { id: 'users', label: 'Utilisateurs' },
    { id: 'wallets', label: 'Portefeuilles' },
    { id: 'payments', label: 'Paiements' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'webhooks', label: 'Webhooks' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CreateUser onUserCreated={triggerRefresh} />
            <UserList onRefresh={refreshKey} />
          </div>
        );
      case 'wallets':
        return <WalletView onRefresh={refreshKey} />;
      case 'payments':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentForm onPaymentCreated={triggerRefresh} />
            <PaymentHistory onRefresh={refreshKey} />
          </div>
        );
      case 'transactions':
        return <TransactionList onRefresh={refreshKey} />;
      case 'webhooks':
        return <WebhookLogs onRefresh={refreshKey} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Passerelle de Paiement</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;