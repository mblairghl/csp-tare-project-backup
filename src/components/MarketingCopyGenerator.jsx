import React, { useContext, useState } from 'react';
import { FunnelContext } from '../context/FunnelContext';

const MarketingCopyGenerator = () => {
  const { funnelContent, marketingCopy, setMarketingCopy } = useContext(FunnelContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateCopy = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funnelContent, persona: 'Author', tone: 'confident' })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to generate');
      setMarketingCopy(data.copy);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">✍️ Generate Marketing Copy</h2>
      <button onClick={generateCopy} disabled={loading} className="mb-4 bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded">
        {loading ? 'Generating…' : 'Generate AI-Powered Copy'}
      </button>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}
      {marketingCopy ? (
        <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded border">{marketingCopy}</div>
      ) : (
        <p className="text-gray-500">No copy generated yet.</p>
      )}
    </div>
  );
};

export default MarketingCopyGenerator;
