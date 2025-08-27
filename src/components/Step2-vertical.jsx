import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, FileText, BarChart2, Lightbulb, Plus, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import ContentBox from './ContentBox';
import ContentAssetModal from './ContentAssetModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step2 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState('placement');
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [contentAssetModalOpen, setContentAssetModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Step completion tracking
  const [isStepComplete, setIsStepComplete] = useState(false);

  // Content data
  const [contentAssets, setContentAssets] = useState([]);
  const [funnelStages, setFunnelStages] = useState({
    'Discover the Possibility': [],
    'Evaluate the Options': [],
    'Overcome the Obstacles': [],
    'Take Action': []
  });
  const [aiResult, setAiResult] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load saved data
  useEffect(() => {
    const savedAssets = storageOptimizer.safeGet('step2_content_assets');
    const savedStages = storageOptimizer.safeGet('step2_funnel_stages');
    
    if (savedAssets && Array.isArray(savedAssets)) {
      setContentAssets(savedAssets);
    }
    
    if (savedStages && typeof savedStages === 'object') {
      setFunnelStages(savedStages);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const hasContent = contentAssets.length >= 5;
    const hasDistribution = Object.values(funnelStages).some(stage => stage.length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = hasContent && hasDistribution;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [contentAssets, funnelStages, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Content asset management
  const handleAddContentAsset = (asset) => {
    const newAsset = {
      ...asset,
      id: Date.now() + Math.random(),
      dateAdded: new Date().toISOString()
    };
    
    const updated = [...contentAssets, newAsset];
    setContentAssets(updated);
    storageOptimizer.safeSet('step2_content_assets', updated);
  };

  const handleDeleteContentAsset = (assetId) => {
    const updated = contentAssets.filter(asset => asset.id !== assetId);
    setContentAssets(updated);
    storageOptimizer.safeSet('step2_content_assets', updated);
  };

  // AI content placement
  const handleAIContentPlacement = async () => {
    setAiModalType('placement');
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateContentPlacement(contentAssets);
      setAiResult(result);
    } catch (error) {
      console.error('Error generating content placement:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // AI gap analysis
  const handleAIGapAnalysis = async () => {
    setAiModalType('gap');
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateGapAnalysis(funnelStages);
      setAiResult(result);
    } catch (error) {
      console.error('Error generating gap analysis:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddSuggestion = (suggestion) => {
    // Add to content assets
    handleAddContentAsset({
      title: suggestion.title,
      type: suggestion.type,
      description: suggestion.description,
      stage: suggestion.stage
    });
    
    // Track as selected
    setSelectedSuggestions(prev => [...prev, suggestion.id]);
  };

  const howThisWorksContent = {
    description: "Audit your existing content and strategically distribute it across your customer journey to maximize impact and identify gaps.",
    steps: [
      { title: 'Content Audit', description: 'Catalog all your existing content assets including blogs, videos, podcasts, and social media posts.', color: 'bg-blue-600', textColor: '#2563eb' },
      { title: 'Strategic Distribution', description: 'Map your content to the four stages of your customer journey for maximum impact.', color: 'bg-green-600', textColor: '#16a34a' },
      { title: 'Gap Analysis', description: 'Identify content gaps and get AI-powered suggestions for new content to complete your strategy.', color: 'bg-purple-600', textColor: '#9333ea' }
    ]
  };

  // Check section completion
  const hasContent = contentAssets.length > 0;
  const hasMinimumContent = contentAssets.length >= 5;
  const hasDistribution = Object.values(funnelStages).some(stage => stage.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {showConfetti && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}

        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 2 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Content Audit & Strategy
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Audit your existing content and strategically distribute it across your customer journey to maximize impact and identify gaps.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-green-600 font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 2 Complete! Your content strategy is mapped and optimized.</p>
              <p className="text-sm text-green-700 mt-1">
                You have {contentAssets.length} content assets strategically distributed across your customer journey.
              </p>
            </div>
          </div>
        )}

        {/* Component 4: How This Works Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">How This Works</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600 font-medium">Expand</span>
              {isHowThisWorksOpen ? (
                <ChevronUp className="w-5 h-5 text-green-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-green-600" />
              )}
            </div>
          </button>
          
          {isHowThisWorksOpen && (
            <div className="px-6 pb-6">
              <p className="text-gray-600 mb-6">{howThisWorksContent.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {howThisWorksContent.steps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All Sections in Vertical Layout */}
        <div className="space-y-8">
          
          {/* Section 1: Content Audit */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {hasContent ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Content Audit</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Catalog all your existing content assets to understand what you have to work with.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setContentAssetModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Content Asset
                </button>
              </div>

              {/* Current Content Assets */}
              {contentAssets.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Your Content Library ({contentAssets.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentAssets.map((asset) => (
                      <ContentBox
                        key={asset.id}
                        title={asset.title}
                        type={asset.type}
                        description={asset.description}
                        onDelete={() => handleDeleteContentAsset(asset.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {contentAssets.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Content Assets Added</h4>
                  <p className="text-gray-600 mb-6">Start by adding your existing content like blog posts, videos, podcasts, and social media content.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Strategic Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {hasDistribution ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Strategic Distribution</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Map your content to the four stages of your customer journey for maximum impact.
            </p>

            {hasMinimumContent ? (
              <div className="space-y-6">
                <button
                  onClick={handleAIContentPlacement}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Content Placement
                </button>

                {/* Funnel Stages Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(funnelStages).map(([stage, assets]) => (
                    <div key={stage} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{stage}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {assets.length} content asset{assets.length !== 1 ? 's' : ''}
                      </p>
                      {assets.length > 0 ? (
                        <div className="space-y-2">
                          {assets.map((asset, index) => (
                            <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                              {asset.title}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">
                          No content assigned
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Add More Content First</h4>
                <p className="text-gray-600 mb-6">You need at least 5 content assets to enable strategic distribution. You currently have {contentAssets.length}.</p>
              </div>
            )}
          </div>

          {/* Section 3: Gap Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {isStepComplete ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Gap Analysis</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Identify content gaps and get AI-powered suggestions for new content to complete your strategy.
            </p>

            {hasDistribution ? (
              <div className="space-y-6">
                <button
                  onClick={handleAIGapAnalysis}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  AI Gap Analysis
                </button>

                {isStepComplete && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Content Strategy Complete</h4>
                      <ul className="text-purple-700 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          Content audit completed with {contentAssets.length} assets
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          Strategic distribution across customer journey
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          Gap analysis identifies optimization opportunities
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">Next Steps</h4>
                      <p className="text-yellow-700 text-sm">
                        Use your content strategy in Step 3 to identify the best lead sources and distribution channels for your content.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Complete Content Distribution First</h4>
                <p className="text-gray-600 mb-6">Map your content to customer journey stages to unlock gap analysis.</p>
              </div>
            )}
          </div>
        </div>

        <StepFooter 
          currentStep={2} 
          totalSteps={9} 
          showNextStep={isStepComplete}
        />

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title={aiModalType === 'placement' ? 'AI Content Placement' : 'AI Gap Analysis'}
          loading={aiLoading}
          selectedCount={selectedSuggestions.length}
        >
          {aiResult && (
            <div>
              <p className="text-gray-600 mb-6">
                {aiModalType === 'placement' 
                  ? 'AI has analyzed your content and suggests the following distribution strategy:'
                  : 'AI has identified gaps in your content strategy and suggests these additions:'
                }
              </p>
              <div className="space-y-4">
                {aiResult.suggestions?.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {suggestion.stage}
                        </span>
                      </div>
                      {aiModalType === 'gap' && (
                        <button
                          onClick={() => handleAddSuggestion(suggestion)}
                          className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          disabled={selectedSuggestions.includes(suggestion.id)}
                        >
                          {selectedSuggestions.includes(suggestion.id) ? 'Added' : 'Add'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AIModal>

        {/* Content Asset Modal */}
        <ContentAssetModal
          isOpen={contentAssetModalOpen}
          onClose={() => setContentAssetModalOpen(false)}
          onSave={handleAddContentAsset}
        />

        {/* API Key Modal */}
        <APIKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSave={handleSaveApiKey}
        />
      </div>
    </div>
  );
};

export default Step2;

