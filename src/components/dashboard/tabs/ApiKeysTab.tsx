import { useState, useEffect } from 'react';
import { apiKeyService } from '@/services/api';

interface ApiKey {
  _id: string;
  key: string;
  status: string;
  created: string;
  lastUsed: string;
}

interface model{
    _id: string,
    name: string,
    description: string,
    category: string,
}

export default function ApiKeysTab() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<model[]>([]);
  const [showModelSelector, setShowModelSelector] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true);
        const response = await apiKeyService.getMyKeys();
        const keys = response.data.api_keys || [];
        setApiKeys(keys);
        console.log(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching API keys:', error);
        setError('Failed to load API keys. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/models');
        const data = await response.json();
        setModels(data.models || []);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchApiKeys();
    fetchModels();
  }, []);

  const handleCreateKey = async () => {
    try {
      if (showModelSelector && !selectedModel) {
        setShowModelSelector(true);
        return;
      }

      const response = await apiKeyService.createKey();
      
      const newKey = response.data.api_key || response.data;
      setApiKeys([...apiKeys, newKey]);
      setShowModelSelector(false);
      setSelectedModel('');
    } catch (error) {
      console.error('Error creating API key:', error);
      setError('Failed to create API key. Please try again later.');
    }
  };

  // Add this before the return statement
//   const handleCreateKeyClick = () => {
//     if (models.length > 0) {
//       setShowModelSelector(true);
//     } else {
//       handleCreateKey();
//     }
//   };

  const handleRevokeKey = async (id: string) => {
    try {
      await apiKeyService.revokeKey(id);
      setApiKeys(apiKeys.map(key => 
        key._id === id ? { ...key, status: 'inactive' } : key
      ));
    } catch (error) {
      console.error('Error revoking API key:', error);
      setError('Failed to revoke API key. Please try again later.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading API keys...</div>;
  }

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My API Keys</h2>
        {/* <button 
          onClick={handleCreateKeyClick}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-indigo-800 transition"
        >
          Create New Key
        </button> */}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {showModelSelector && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-lg font-medium mb-4">Select a Model for Your API Key</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a model</option>
              {models.map((model) => (
                <option key={model?._id} value={model?._id}>
                  {(model as { name: string }).name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModelSelector(false)}
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateKey}
              disabled={!selectedModel}
              className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-indigo-800 transition ${!selectedModel && 'opacity-50 cursor-not-allowed'}`}
            >
              Create
            </button>
          </div>
        </div>
      )}
      
      {apiKeys.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">You don't have any API keys yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(key.created).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button 
                      className={`text-yellow-600 hover:text-yellow-900 mr-3 ${key.status !== 'active' && 'opacity-50 cursor-not-allowed'}`}
                      disabled={key.status !== 'active'}
                    >
                      Regenerate
                    </button>
                    <button 
                      onClick={() => key.status === 'active' && handleRevokeKey(key._id)}
                      className={`text-red-600 hover:text-red-900 ${key.status !== 'active' && 'opacity-50 cursor-not-allowed'}`}
                      disabled={key.status !== 'active'}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">API Key Security</h3>
        <p className="text-gray-600 mb-4">
          Your API keys carry many privileges. Be sure to keep them secure! Do not share your API keys in publicly accessible areas such as GitHub, client-side code, etc.
        </p>
        <div className="flex items-center text-sm text-green-600">
          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          All API requests are encrypted with TLS
        </div>
      </div>
    </div>
  );
}