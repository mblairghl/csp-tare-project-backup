import React, { useContext, useState } from 'react';
import { FunnelContext } from '../context/FunnelContext';
import ContentLibrary from './ContentLibrary';
import MarketingCopyGenerator from './MarketingCopyGenerator';
import GapAnalysisModal from './GapAnalysisModal';
import StepNavigation from './StepNavigation';

const Dashboard = () => {
  const {
    funnelContent,
    activeStep,
    setActiveStep,
    gapAnalysis,
    setGapAnalysis,
    showGapModal,
    setShowGapModal,
    marketingCopy
  } = useContext(FunnelContext);

  const [gapLoading, setGapLoading] = useState(false);
  const [gapError, setGapError] = useState(null);

  const runGap = async () => {
    setGapLoading(true);
    setGapError(null);
    try {
      const res = await fetch('/.netlify/functions/gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funnelContent })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Gap analysis failed');
      setGapAnalysis(data);
      setShowGapModal(true);
    } catch (e) {
      setGapError(e.message);
    } finally {
      setGapLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Authority Revenue Toolkit Dashboard</h1>
      <StepNavigation activeStep={activeStep} setActiveStep={setActiveStep} />
      {activeStep === 0 && <ContentLibrary />}
      {activeStep === 1 && <MarketingCopyGenerator copy={marketingCopy} />}
      {activeStep === 2 && (
        <div className="space-y-2">
          <button onClick={runGap} disabled={gapLoading} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-2 rounded">
            {gapLoading ? 'Analyzing…' : 'Run Gap Analysis'}
          </button>
          {gapError && <p className="text-red-600">Error: {gapError}</p>}
        </div>
      )}
      {showGapModal && (
        <GapAnalysisModal
          funnelContent={funnelContent}
          gapAnalysis={gapAnalysis}
          onClose={() => setShowGapModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
