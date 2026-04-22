import { useState, useEffect } from 'react';
import webhookService from './webhookService';

function WebhookLogs({ onRefresh }) {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'all') {
        response = await webhookService.getAllWebhookLogs();
      } else {
        response = await webhookService.getWebhookLogsBySentStatus(filter === 'sent');
      }
      setWebhooks(response.data);
      setError('');
    } catch (err) {
      setError('Échec du chargement des logs webhook');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, [filter, onRefresh]);

  const handleRetry = async (id) => {
    try {
      await webhookService.retryWebhook(id);
      fetchWebhooks();
    } catch (err) {
      alert('Échec de la tentative de renvoi du webhook');
    }
  };

  const getSentColor = (sent) => {
    return sent 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Logs Webhook</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Tous</option>
            <option value="sent">Envoyé</option>
            <option value="failed">Échoué</option>
          </select>
          <button
            onClick={fetchWebhooks}
            className="text-blue-600 hover:text-blue-800"
          >
            Actualiser
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Chargement...</div>
      ) : webhooks.length === 0 ? (
        <p className="text-gray-500">Aucun log webhook trouvé</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Événement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réponse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {webhooks.map((wh) => (
                <tr key={wh.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{wh.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{wh.paymentId || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{wh.eventType || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{wh.responseCode || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${getSentColor(wh.sent)}`}>
                      {wh.sent ? 'Envoyé' : 'Échoué'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!wh.sent && (
                      <button
                        onClick={() => handleRetry(wh.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Réessayer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WebhookLogs;