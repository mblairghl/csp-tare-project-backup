import React, { useState } from 'react';

const APIKeyModal = ({ isOpen, onClose, onSave, currentApiKey = '' }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">OpenAI API Key</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              To use AI features, please enter your OpenAI API key. This will be stored locally in your browser.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">How to get your API key:</h4>
              <ol className="text-blue-700 text-sm space-y-1">
                <li>1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                <li>2. Sign in to your OpenAI account</li>
                <li>3. Click "Create new secret key"</li>
                <li>4. Copy the key and paste it below</li>
              </ol>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0e9246' }}
            >
              Save API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyModal;

