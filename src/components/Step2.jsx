import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import ContentAssetModal from './ContentAssetModal';
import aiService from '../services/aiService';

// Utility functions for localStorage management
const safeLocalStorageGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    if (error.name === 'QuotaExceededError') {
      alert('Browser storage is full. Please use the "Clear All My Data & Fix App" button on the Dashboard to continue.');
    }
    return false;
  }
};

const Step2 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [activeSubStep, setActiveSubStep] = useState('content-library');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState('placement');
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [contentAssetModalOpen, setContentAssetModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Content assets state
  const [contentAssets, setContentAssets] = useState([]);
  const [funnelStages, setFunnelStages] = useState({
    'discover-possibility': [],
    'resonate-mission': [],
    'envision-transformation': [],
    'trust-process': [],
    'step-into-authority': []
  });
  const [aiContentSuggestions, setAiContentSuggestions] = useState(null);
  const [aiGapAnalysis, setAiGapAnalysis] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [aiSuggestionSet, setAiSuggestionSet] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load saved data on component mount
  useEffect(() => {
    const savedAssets = safeLocalStorageGet('contentAssets', []);
    const savedFunnelStages = safeLocalStorageGet('funnelStages', {
      'discover-possibility': [],
      'resonate-mission': [],
      'envision-transformation': [],
      'trust-process': [],
      'step-into-authority': []
    });
    setContentAssets(savedAssets);
    setFunnelStages(savedFunnelStages);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (contentAssets.length > 0 || Object.values(funnelStages).some(stage => stage.length > 0)) {
      safeLocalStorageSet('contentAssets', contentAssets);
    }
  }, [contentAssets]);

  useEffect(() => {
    if (Object.values(funnelStages).some(stage => stage.length > 0)) {
      safeLocalStorageSet('funnelStages', funnelStages);
    }
  }, [funnelStages]);

  const handleSubStepChange = (subStep) => {
    setActiveSubStep(subStep);
    if (subStep === 'milestone-reflection') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleAddContentAsset = () => {
    setContentAssetModalOpen(true);
  };

  const handleSaveContentAsset = (newAsset) => {
    setContentAssets([...contentAssets, newAsset]);
  };

  const handleAIPlacementSuggestions = async () => {
    console.log('DEBUG - handleAIPlacementSuggestions called!');
    
    // Reset AI state for new session
    setAiContentSuggestions(null);
    setAiGapAnalysis(null);
    setAiLoading(true);
    setAiModalOpen(true);
    setAiModalType('placement');

    try {
      const savedPersonas = safeLocalStorageGet('personas', []);
      const businessInfo = {
        industry: 'Business Consulting',
        offer: 'Authority Revenue Toolkit - systematic business growth framework',
        personas: savedPersonas.length > 0 ? savedPersonas.map(p => p.name).join(', ') : 'Business owners and entrepreneurs'
      };
      
      console.log('DEBUG - About to call AI service with:', businessInfo);
      const analysis = await aiService.generateContentSuggestions(businessInfo);
      console.log('DEBUG - Step2 - Analysis received:', analysis);
      setAiContentSuggestions(analysis);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      console.error('Error stack:', error.stack);
      // Fallback analysis
      setAiContentSuggestions({
        message: "Unable to analyze content at this time. Please try again.",
        contentAnalysis: [],
        totalItems: 0
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIGapAnalysis = async () => {
    // Reset AI state for new session
    setAiContentSuggestions(null);
    setAiGapAnalysis(null);
    setSelectedSuggestions([]);
    setAiSuggestionSet(1);

    setAiModalOpen(true);
    setAiModalType('gap');
    setAiLoading(true);
    
    try {
      // Generate gap analysis using the AI service
      const savedPersonas = safeLocalStorageGet('savedPersonas', []);
      const businessInfo = {
        business: 'Business coaching and consulting services',
        offer: 'Authority Revenue Toolkit - systematic business growth framework',
        personas: savedPersonas.length > 0 ? savedPersonas.map(p => p.name).join(', ') : 'Business owners and entrepreneurs'
      };
      
      console.log('DEBUG - Gap Analysis - Business Info:', businessInfo);
      const gapAnalysis = await aiService.generateGapAnalysis(businessInfo);
      console.log('DEBUG - Gap Analysis - Result:', gapAnalysis);
      setAiGapAnalysis(gapAnalysis);
    } catch (error) {
      console.error('Error generating gap analysis:', error);
      setAiGapAnalysis({
        message: "Error generating gap analysis. Please try again.",
        gaps: [],
        suggestions: [],
        overallStatus: "Error"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddAISuggestion = (suggestion, stage, suggestionIndex) => {
    // Find the existing content item using contentId
    const contentItem = contentAssets.find(item => item.id === suggestion.contentId);
    
    if (contentItem) {
      // Add the existing content to the suggested funnel stage
      setFunnelStages(prev => {
        const updated = { ...prev };
        const targetStage = suggestion.suggestedStage;
        
        if (!updated[targetStage]) {
          updated[targetStage] = [];
        }
        
        // Check if item is already in this stage
        const alreadyExists = updated[targetStage].some(item => item.id === contentItem.id);
        if (!alreadyExists) {
          updated[targetStage] = [...updated[targetStage], contentItem];
        }
        
        return updated;
      });
      
      // Remove the content from contentAssets (unmapped content)
      setContentAssets(prev => prev.filter(item => item.id !== suggestion.contentId));
      
      // Track that this suggestion was selected and remove it from the analysis
      setSelectedSuggestions(prev => [...prev, suggestion.contentId]);
      
      // Remove this suggestion from the current analysis
      setAiContentSuggestions(prev => {
        if (!prev || !prev.contentAnalysis) return prev;
        
        return {
          ...prev,
          contentAnalysis: prev.contentAnalysis.filter(item => item.contentId !== suggestion.contentId),
          totalItems: prev.totalItems - 1
        };
      });
    }
  };

  const handleAddGapSuggestion = (suggestion, suggestionIndex) => {
    // Create a new content asset from the gap suggestion
    const newContentAsset = {
      id: `gap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: suggestion.title,
      description: suggestion.description,
      type: suggestion.type,
      notes: `AI-suggested content for ${suggestion.stageName} stage`
    };
    
    // Add directly to the appropriate funnel stage (not to content library)
    setFunnelStages(prev => {
      const updated = { ...prev };
      const targetStage = suggestion.stage;
      
      if (!updated[targetStage]) {
        updated[targetStage] = [];
      }
      
      // Add the content to the target stage
      updated[targetStage] = [...updated[targetStage], newContentAsset];
      
      return updated;
    });
    
    // Track that this suggestion was selected
    setSelectedSuggestions(prev => [...prev, suggestion.id]);
    
    // Remove this suggestion from the gap analysis
    setAiGapAnalysis(prev => {
      if (!prev || !prev.suggestions) return prev;
      
      return {
        ...prev,
        suggestions: prev.suggestions.filter(s => s.id !== suggestion.id)
      };
    });
  };

  const handleMoreAISuggestions = async () => {
    setAiLoading(true);
    
    try {
      // Get personas from Step 1
      const savedPersonas = safeLocalStorageGet('savedPersonas', []);
      const businessInfo = {
        business: 'Business coaching and consulting services',
        offer: 'Authority Revenue Toolkit - systematic business growth framework',
        personas: savedPersonas.length > 0 ? savedPersonas.map(p => p.name).join(', ') : 'Business owners and entrepreneurs',
        set: aiSuggestionSet + 1 // Request next set
      };

      let newSuggestions;
      
      // Check if this is gap analysis (only generate for gap stages)
      if (aiGapAnalysis && !aiGapAnalysis.noGaps) {
        // For gap analysis, only generate for stages with less than 2 items
        const gaps = [];
        Object.entries(funnelStages).forEach(([stage, items]) => {
          if (items.length < 2) {
            gaps.push(stage);
          }
        });
        businessInfo.gaps = gaps;
        newSuggestions = await aiService.generateGapAnalysis(businessInfo);
        
        // For gap analysis, merge suggestions
        setAiGapAnalysis(prev => {
          if (!prev) return newSuggestions;
          
          return {
            ...prev,
            suggestions: [...(prev.suggestions || []), ...(newSuggestions.suggestions || [])]
          };
        });
      } else {
        // For regular placement suggestions, generate for all stages
        newSuggestions = await aiService.generateContentSuggestions(businessInfo);
        
        // Merge new suggestions with existing ones
        setAiContentSuggestions(prev => {
          if (!prev) return newSuggestions;
          
          const merged = { ...prev };
          Object.keys(newSuggestions).forEach(stage => {
            merged[stage] = [...(merged[stage] || []), ...newSuggestions[stage]];
          });
          return merged;
        });
      }
      
      setAiSuggestionSet(prev => prev + 1);
    } catch (error) {
      console.error('Error generating more AI suggestions:', error);
      // Fallback to basic suggestions
      const fallbackSuggestions = {
        "discover-possibility": [
          {
            title: "Additional Content Idea",
            description: "More content suggestions for this stage.",
            type: "Article"
          }
        ]
      };
      
      setAiContentSuggestions(prev => {
        if (!prev) return fallbackSuggestions;
        
        const merged = { ...prev };
        Object.keys(fallbackSuggestions).forEach(stage => {
          merged[stage] = [...(merged[stage] || []), ...fallbackSuggestions[stage]];
        });
        return merged;
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  const handleDragStart = (e, asset) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(asset));
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    const assetData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Remove from content assets
    setContentAssets(contentAssets.filter(asset => asset.id !== assetData.id));
    
    // Add to funnel stage
    setFunnelStages(prev => ({
      ...prev,
      [stageId]: [...prev[stageId], assetData]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const funnelStageData = [
    {
      id: 'discover-possibility',
      title: 'Discover the Possibility',
      description: 'They become aware that a better way exists.',
      color: 'border-green-300'
    },
    {
      id: 'resonate-mission',
      title: 'Resonate with the Mission',
      description: 'They connect emotionally with your message and positioning.',
      color: 'border-blue-300'
    },
    {
      id: 'envision-transformation',
      title: 'Envision Their Transformation',
      description: 'They see the tangible results of working with you.',
      color: 'border-yellow-300'
    },
    {
      id: 'trust-process',
      title: 'Trust the Process',
      description: 'They gain confidence in your ability to deliver.',
      color: 'border-orange-300'
    },
    {
      id: 'step-into-authority',
      title: 'Step Into Authority',
      description: 'They are ready to take action and invest.',
      color: 'border-blue-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 2 OF 9
        </div>

        {/* Step Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Content Audit & Mapping
        </h1>

        {/* Step Objective */}
        <p className="text-lg text-gray-600 mb-6">
          Organize your content and map it to the customer journey
        </p>

        {/* How This Works Section */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <h3 className="text-green-800 font-semibold text-lg">How This Works</h3>
            </div>
            <button
              onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
              className="text-green-600 hover:text-green-800 transition-colors text-sm px-3 py-1 bg-green-100 rounded"
            >
              {isHowThisWorksOpen ? (
                <>Collapse <ChevronUp className="w-4 h-4 inline ml-1" /></>
              ) : (
                <>Expand <ChevronDown className="w-4 h-4 inline ml-1" /></>
              )}
            </button>
          </div>
          
          {isHowThisWorksOpen && (
            <div className="mt-4 bg-white p-4 rounded border border-green-200">
              <p className="text-gray-600 text-sm mb-4">
                Audit your existing content and map it to the customer journey stages to identify gaps and optimize your marketing funnel.
              </p>
            </div>
          )}
        </div>

        {/* Sub-Step Navigation */}
        <div className="bg-white rounded-lg border shadow-lg mb-8">
          <div className="flex border-b">
            <button
              onClick={() => handleSubStepChange('content-library')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSubStep === 'content-library'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeSubStep === 'content-library' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <div className="text-left">
                  <div className="font-medium">Content Library</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSubStepChange('marketing-copy')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSubStep === 'marketing-copy'
                  ? 'border-yellow-500 text-yellow-600 bg-yellow-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeSubStep === 'marketing-copy' ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  🔒
                </div>
                <div className="text-left">
                  <div className="font-medium">Marketing Copy & TARE</div>
                  <div className="text-xs text-gray-500">Map content to 3+ stages</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSubStepChange('milestone-reflection')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSubStep === 'milestone-reflection'
                  ? 'border-yellow-500 text-yellow-600 bg-yellow-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeSubStep === 'milestone-reflection' ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  🔒
                </div>
                <div className="text-left">
                  <div className="font-medium">Milestone Reflection</div>
                  <div className="text-xs text-gray-500">Complete marketing copy</div>
                </div>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeSubStep === 'content-library' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Content Library */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Library</h3>
                  <p className="text-gray-600 mb-4">
                    Drag items to the funnel or use AI to help.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <button 
                        onClick={handleAddContentAsset}
                        className="text-white px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 flex items-center space-x-2"
                        style={{ backgroundColor: '#fbae42' }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Content Asset</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!aiLoading && !aiModalOpen) {
                            handleAIPlacementSuggestions();
                          }
                        }}
                        disabled={aiLoading || aiModalOpen}
                        className="text-black px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 flex items-center space-x-2 disabled:opacity-50"
                        style={{ backgroundColor: '#d7df21' }}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>AI Placement Suggestions</span>
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                      {contentAssets.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No unmapped content</p>
                      ) : (
                        <div className="space-y-2">
                          {contentAssets.map((asset) => (
                            <div
                              key={asset.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, asset)}
                              className="bg-white p-3 rounded border cursor-move hover:shadow-md transition-shadow"
                            >
                              <h4 className="font-medium text-gray-900">{asset.title}</h4>
                              <p className="text-sm text-gray-600">{asset.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Funnel Content Goal */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Funnel Content Goal</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <button 
                        onClick={handleAIGapAnalysis}
                        className="text-black px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 flex items-center space-x-2"
                        style={{ backgroundColor: '#d7df21' }}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>AI Gap Analysis</span>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Goal: At least 2 content items per stage to start.
                  </p>

                  <div className="space-y-4">
                    {funnelStageData.map((stage) => (
                      <div
                        key={stage.id}
                        onDrop={(e) => handleDrop(e, stage.id)}
                        onDragOver={handleDragOver}
                        className={`border-2 border-dashed ${stage.color} rounded-lg p-4 min-h-[100px] transition-colors hover:bg-gray-50`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{stage.title}</h4>
                          <span className="text-sm text-gray-500">{funnelStages[stage.id].length} items</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                        
                        {funnelStages[stage.id].length === 0 ? (
                          <p className="text-gray-400 text-center py-4">Drop content here</p>
                        ) : (
                          <div className="space-y-2">
                            {funnelStages[stage.id].map((item) => (
                              <div key={item.id} className="bg-white p-2 rounded border">
                                <h5 className="font-medium text-gray-800 text-sm">{item.title}</h5>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSubStep === 'marketing-copy' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Copy & TARE</h3>
                <p className="text-gray-600 mb-6">
                  Create compelling marketing copy for each funnel stage using the TARE framework.
                </p>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-700">
                    🔒 This section will be unlocked after mapping content to at least 3 funnel stages.
                  </p>
                </div>
              </div>
            )}

            {activeSubStep === 'milestone-reflection' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">
                  Celebrate your progress in organizing and mapping your content to the customer journey!
                </p>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                  <h4 className="font-semibold text-green-800 mb-4">🎯 What You've Accomplished</h4>
                  <ul className="space-y-2 text-green-700">
                    <li>✅ Audited your existing content assets</li>
                    <li>✅ Mapped content to customer journey stages</li>
                    <li>✅ Identified gaps in your content funnel</li>
                    <li>✅ Created a strategic content distribution plan</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-4">🔄 How This Connects to Future Steps</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li><strong>Step 3 - Lead Intelligence:</strong> Your content map will inform lead scoring and qualification</li>
                    <li><strong>Step 4 - Signature Funnel:</strong> Mapped content becomes the foundation of your funnel</li>
                    <li><strong>Step 5 - Sales Pipeline:</strong> Content stages align with sales conversation flow</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-4">💼 Business Impact</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Systematic content strategy instead of random posting</li>
                    <li>• Clear customer journey with strategic touchpoints</li>
                    <li>• Improved conversion rates through targeted messaging</li>
                    <li>• Foundation for automated marketing sequences</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <StepFooter 
          currentStep={2} 
          showNextStep={activeSubStep === 'milestone-reflection'}
        />

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => {
            setAiModalOpen(false);
            setAiContentSuggestions(null);
            setAiGapAnalysis(null);
            setSelectedSuggestions([]);
            setAiSuggestionSet(1);
          }}
          title={aiContentSuggestions ? "AI Content Suggestions" : aiGapAnalysis ? "AI Gap Analysis" : "AI Analysis"}
          loading={aiLoading}
          showCloseInstructions={false}
          selectedCount={selectedSuggestions.length}
          showMoreIdeas={!!aiContentSuggestions && !aiLoading}
          onMoreIdeas={handleMoreAISuggestions}
          maxSets={4}
          currentSet={aiSuggestionSet}
        >
          <div>
            {aiContentSuggestions && aiContentSuggestions.contentAnalysis && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">
                  {aiContentSuggestions.message}
                  {selectedSuggestions.length > 0 && (
                    <span className="text-green-600 font-semibold ml-2">
                      {selectedSuggestions.length} item(s) placed!
                    </span>
                  )}
                </p>
                
                {aiContentSuggestions.contentAnalysis.length > 0 ? (
                  <div className="space-y-4">
                    {aiContentSuggestions.contentAnalysis.map((analysis, index) => (
                      <div key={analysis.contentId || index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{analysis.contentTitle}</h4>
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2">
                              {analysis.contentType}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              analysis.confidence === 'High' ? 'bg-green-100 text-green-800' :
                              analysis.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {analysis.confidence} Confidence
                            </span>
                            
                            <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-500">
                              <h5 className="font-medium text-blue-800 mb-1">
                                Suggested Stage: {analysis.stageName}
                              </h5>
                              <p className="text-sm text-gray-700">{analysis.reasoning}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddAISuggestion(analysis, analysis.suggestedStage, index)}
                            className="ml-3 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">All content has been placed in funnel stages!</p>
                  </div>
                )}
              </div>
            )}

            {aiContentSuggestions && aiContentSuggestions.message && !aiContentSuggestions.contentAnalysis && (
              <div className="text-center py-8">
                <p className="text-gray-600">{aiContentSuggestions.message}</p>
              </div>
            )}

            {/* Gap Analysis Results */}
            {aiGapAnalysis && aiGapAnalysis.gaps && aiGapAnalysis.suggestions && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">
                  {aiGapAnalysis.message}
                  {selectedSuggestions.length > 0 && (
                    <span className="text-green-600 font-semibold ml-2">
                      {selectedSuggestions.length} suggestion(s) added!
                    </span>
                  )}
                </p>

                {/* Gap Summary */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-blue-800 mb-3">Content Gaps Identified:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiGapAnalysis.gaps.map((gap, index) => (
                      <div key={gap.stage} className="bg-white p-3 rounded border-l-4 border-blue-500">
                        <h5 className="font-medium text-gray-900">{gap.stageName}</h5>
                        <p className="text-sm text-gray-600">
                          Has {gap.currentCount} item(s), needs {gap.needed} more
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Suggestions */}
                {aiGapAnalysis.suggestions.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Targeted Content Suggestions:</h4>
                    {aiGapAnalysis.suggestions.map((suggestion, index) => (
                      <div key={suggestion.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {suggestion.stageName}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                suggestion.priority === 'High' ? 'bg-red-100 text-red-800' :
                                suggestion.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {suggestion.priority} Priority
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                              {suggestion.type}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddGapSuggestion(suggestion, index)}
                            className="ml-3 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">All gap suggestions have been added!</p>
                  </div>
                )}
              </div>
            )}

            {aiGapAnalysis && aiGapAnalysis.overallStatus === "Complete" && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Content Goals Achieved!</h3>
                <p className="text-gray-600">{aiGapAnalysis.message}</p>
              </div>
            )}

            {!aiContentSuggestions && !aiGapAnalysis && !aiLoading && (
              <p className="text-gray-600">
                AI analysis will appear here once generated.
              </p>
            )}
          </div>
        </AIModal>

        {/* API Key Modal */}
        <APIKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSave={handleSaveApiKey}
          currentApiKey={aiService.getApiKey()}
        />

        {/* Content Asset Modal */}
        <ContentAssetModal
          isOpen={contentAssetModalOpen}
          onClose={() => setContentAssetModalOpen(false)}
          onSave={handleSaveContentAsset}
        />
      </div>
    </div>
  );
};

export default Step2;

