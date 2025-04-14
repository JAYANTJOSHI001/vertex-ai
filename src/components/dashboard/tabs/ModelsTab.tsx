import { useState, useEffect } from 'react';
import { modelService } from '@/services/api';

interface Model {
  _id: string;
  name: string;
  description: string;
  lastUsed?: string;
  rating?: number;
  category?: string;
}

export default function ModelsTab() {
  const [savedModels, setSavedModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        
        // Try to get user's own models first (if they're a developer)
        try {
          const myModelsResponse = await modelService.getMyModels();
          // Check if the response has a models property or is an array directly
          const models = myModelsResponse.data.models || myModelsResponse.data || [];
          // Ensure models is an array
          setSavedModels(Array.isArray(models) ? models : []);
        } catch (error) {
          // If not a developer or no models, get recently used models
          const allModelsResponse = await modelService.getAllModels({ 
            sort: 'popular',
            limit: 4
          });
          // Check if the response has a models property or is an array directly
          const models = allModelsResponse.data.models || allModelsResponse.data || [];
          // Ensure models is an array
          setSavedModels(Array.isArray(models) ? models : []);
        }
        
        setError('');
      } catch (error) {
        console.error('Error fetching models:', error);
        setError('Failed to load models. Please try again later.');
        // Set fallback data
        setSavedModels(getFallbackModelData());
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Fallback data if API fails
  const getFallbackModelData = () => [
    { _id: '1', name: 'GPT-4', description: 'Advanced language model for text generation', lastUsed: '2023-10-30', rating: 4.8 },
    { _id: '2', name: 'DALL-E 3', description: 'Image generation from textual descriptions', lastUsed: '2023-10-28', rating: 4.7 },
    { _id: '3', name: 'Stable Diffusion XL', description: 'High-quality image generation model', lastUsed: '2023-10-25', rating: 4.5 },
    { _id: '4', name: 'Claude 2', description: 'Conversational AI assistant', lastUsed: '2023-10-20', rating: 4.6 },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading models...</div>;
  }

  return (
    <div className="space-y-6 text-black">
      <h2 className="text-2xl font-bold">Saved Models</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {savedModels.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">You haven't used any models yet. Browse the marketplace to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          {savedModels.map((model) => (
            <div key={model._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">{model.name}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(model.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">{model.rating || 'N/A'}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{model.description}</p>
              {model.lastUsed && (
                <p className="text-sm text-gray-500 mt-2">
                  Last used: {new Date(model.lastUsed).toLocaleDateString()}
                </p>
              )}
              <div className="mt-4 flex space-x-2">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1 rounded-md hover:from-blue-700 hover:to-indigo-800 transition text-sm">
                  Test Again
                </button>
                <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 transition text-sm">
                  View API Docs
                </button>
                <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 transition text-sm">
                  Leave Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Explore More Models</h3>
        <p className="text-gray-600 mb-4">
          Discover new AI models to enhance your applications. VertexAI offers a wide range of models for various use cases.
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-indigo-800 transition">
          Browse Marketplace
        </button>
      </div>
    </div>
  );
}