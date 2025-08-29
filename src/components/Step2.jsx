import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, FileText, BarChart2, Lightbulb, Plus, Sparkles, Search, Target, X, Edit, Trash2, Upload, Move } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step2 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Tab management
  const [activeSubStep, setActiveSubStep] = useState(1);

  // Step completion tracking
  const [isStepComplete, setIsStepComplete] = useState(false);

  // Content library and funnel data
  const [contentLibrary, setContentLibrary] = useState([]);
  const [marketingFunnel, setMarketingFunnel] = useState({
    'discover': [],
    'resonate': [],
    'envision': [],
    'trust': [],
    'authority': []
  });

  // Modal states
  const [addContentModalOpen, setAddContentModalOpen] = useState(false);
  const [newContentForm, setNewContentForm] = useState({
    title: '',
    type: '',
    description: '',
    url: '',
    notes: ''
  });

  // AI suggestions
  const [aiResult, setAiResult] = useState(null);

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
    const savedLibrary = storageOptimizer.safeGet('step2_content_library');
    const savedFunnel = storageOptimizer.safeGet('step2_marketing_funnel');
    
    if (savedLibrary && Array.isArray(savedLibrary)) {
      setContentLibrary(savedLibrary);
    }
    if (savedFunnel && typeof savedFunnel === 'object') {
      setMarketingFunnel(savedFunnel);
    }
  }, []);

  // Auto-progression logic
  useEffect(() => {
    const hasContent = contentLibrary.length > 0;
    const hasMappedContent = Object.values(marketingFunnel).some(stage => stage.length > 0);
    
    if (hasContent && activeSubStep === 1) {
      setActiveSubStep(2);
    }
    if (hasMappedContent && activeSubStep === 2) {
      setActiveSubStep(3);
    }
  }, [contentLibrary, marketingFunnel, activeSubStep]);

  // Confetti effect for milestone
  React.useEffect(() => {
    if (activeSubStep === 3 && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [activeSubStep, showConfetti]);

  const funnelStages = [
    {
      id: 'discover',
      title: 'Discover the Possibility',
      description: 'They become aware that a better way exists.',
      color: 'bg-blue-50 border-blue-200',
      items: 2
    },
    {
      id: 'resonate',
      title: 'Resonate with the Mission',
      description: 'They connect emotionally with your message and positioning.',
      color: 'bg-green-50 border-green-200',
      items: 2
    },
    {
      id: 'envision',
      title: 'Envision Their Transformation',
      description: 'They see the tangible results of working with you.',
      color: 'bg-yellow-50 border-yellow-200',
      items: 2
    },
    {
      id: 'trust',
      title: 'Trust the Process',
      description: 'They gain confidence in your ability to deliver.',
      color: 'bg-orange-50 border-orange-200',
      items: 2
    },
    {
      id: 'authority',
      title: 'Step Into Authority',
      description: 'They are ready to take action and invest.',
      color: 'bg-purple-50 border-purple-200',
      items: 2
    }
  ];

  const handleAddContent = () => {
    if (newContentForm.title && newContentForm.type) {
      const newContent = {
        id: Date.now(),
        ...newContentForm,
        dateAdded: new Date().toISOString()
      };
      
      const updatedLibrary = [...contentLibrary, newContent];
      setContentLibrary(updatedLibrary);
      storageOptimizer.safeSet('step2_content_library', updatedLibrary);
      
      setNewContentForm({
        title: '',
        type: '',
        description: '',
        url: '',
        notes: ''
      });
      setAddContentModalOpen(false);
    }
  };

  const handleAIPlacement = async () => {
    if (contentLibrary.length === 0) {
      alert('Please add some content first before using AI placement suggestions.');
      return;
    }

    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      // Simulate AI placement suggestions
      const suggestions = contentLibrary.map(content => ({
        contentId: content.id,
        contentTitle: content.title,
        suggestedStage: funnelStages[Math.floor(Math.random() * funnelStages.length)].id,
        reasoning: `Based on the content type "${content.type}" and description, this content would work best in this funnel stage.`
      }));
      
      setAiResult({
        type: 'placement',
        suggestions: suggestions
      });
    } catch (error) {
      console.error('Error generating AI placement:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGapAnalysis = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      // Simulate gap analysis
      const gaps = funnelStages.filter(stage => 
        marketingFunnel[stage.id].length === 0
      ).map(stage => ({
        stage: stage.title,
        suggestions: [
          `Create a ${stage.title.toLowerCase()} focused blog post`,
          `Develop a ${stage.title.toLowerCase()} video series`,
          `Design a ${stage.title.toLowerCase()} lead magnet`
        ]
      }));
      
      setAiResult({
        type: 'gaps',
        gaps: gaps
      });
    } catch (error) {
      console.error('Error generating gap analysis:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const moveContentToFunnel = (contentId, stageId) => {
    const content = contentLibrary.find(c => c.id === contentId);
    if (!content) return;

    // Remove from current stage if exists
    const updatedFunnel = { ...marketingFunnel };
    Object.keys(updatedFunnel).forEach(stage => {
      updatedFunnel[stage] = updatedFunnel[stage].filter(c => c.id !== contentId);
    });

    // Add to new stage
    updatedFunnel[stageId] = [...updatedFunnel[stageId], content];
    
    setMarketingFunnel(updatedFunnel);
    storageOptimizer.safeSet('step2_marketing_funnel', updatedFunnel);
  };

  const howThisWorksContent = {
    title: "How This Step Works",
    description: "Follow these Action Steps to audit your existing content and map it to your customer journey for maximum impact.",
    steps: [
      {
        title: "Content Library",
        description: "Add your existing content assets and let AI suggest where they fit in your marketing funnel.",
        color: "bg-[#fbae42]"
      },
      {
        title: "Marketing Copy & TARE", 
        description: "Map content to funnel stages and use AI to identify gaps in your content strategy.",
        color: "bg-[#0e9246]"
      },
      {
        title: "Milestone Reflection",
        description: "Review your content mapping and celebrate your strategic content organization.",
        color: "bg-[#467a8f]"
      }
    ]
  };

  // Completion logic
  const hasContentLibrary = contentLibrary.length > 0;
  const hasMappedContent = Object.values(marketingFunnel).some(stage => stage.length > 0);
  const hasGapAnalysis = Object.values(marketingFunnel).every(stage => stage.length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasContentLibrary; // Unlocked when content added
      case 3: return hasContentLibrary && hasMappedContent; // Unlocked when content mapped
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Content Library', icon: FileText },
    { id: 2, title: 'Marketing Copy & TARE', icon: Target },
    { id: 3, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Content Library */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Library</h3>
              <p className="text-gray-600 mb-6">
                Drag items to the funnel or use AI to help.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setAddContentModalOpen(true)}
                    className="flex-1 px-6 py-3 bg-[#0e9246] text-white rounded-md hover:bg-[#0c7a3a] flex items-center justify-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Content Asset
                  </button>
                </div>
                
                <button
                  onClick={handleAIPlacement}
                  className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center justify-center gap-2 font-medium transition-colors duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Placement Suggestions
                </button>
              </div>

              {/* Content Items */}
              <div className="space-y-3">
                {contentLibrary.length > 0 ? (
                  contentLibrary.map((content) => (
                    <div 
                      key={content.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                      draggable
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">{content.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{content.type}</p>
                          {content.description && (
                            <p className="text-sm text-gray-500 mt-2">{content.description}</p>
                          )}
                        </div>
                        <Move className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No unmapped content</p>
                  </div>
                )}
              </div>
            </div>

            {/* Marketing Funnel */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Funnel Content Goal</h3>
                <button
                  onClick={handleGapAnalysis}
                  className="px-4 py-2 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                >
                  <Target className="w-4 h-4" />
                  AI Gap Analysis
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Goal: At least 2 content items per stage to start.
              </p>

              <div className="space-y-4">
                {funnelStages.map((stage) => (
                  <div 
                    key={stage.id}
                    className={`p-4 rounded-lg border-2 border-dashed ${stage.color} min-h-[120px]`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{stage.title}</h4>
                      <span className="text-sm text-gray-500">{marketingFunnel[stage.id].length} items</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                    
                    <div className="space-y-2">
                      {marketingFunnel[stage.id].map((content) => (
                        <div 
                          key={content.id}
                          className="p-2 bg-white rounded border border-gray-200 text-sm"
                        >
                          <div className="font-medium text-gray-900">{content.title}</div>
                          <div className="text-gray-500">{content.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Copy & TARE Analysis</h3>
              <p className="text-gray-600 mb-6">
                Review your content mapping and optimize for each funnel stage. Use AI to identify gaps and opportunities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Content Distribution</h4>
                  {funnelStages.map((stage) => (
                    <div key={stage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{stage.title}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        marketingFunnel[stage.id].length >= 2 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {marketingFunnel[stage.id].length} items
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Gap Analysis</h4>
                  <button
                    onClick={handleGapAnalysis}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center justify-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Gap Analysis
                  </button>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">📊 Content Strategy Insights</h5>
                    <p className="text-blue-800 text-sm">
                      AI will analyze your content distribution and suggest specific content pieces needed to complete your marketing funnel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {showConfetti && activeSubStep === 3 && (
              <Confetti
                width={windowDimensions.width}
                height={windowDimensions.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.3}
              />
            )}
            
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Step 2 Milestone Celebration!</h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0e9246] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Congratulations! 🎊</h4>
                    <p className="text-gray-600">You've completed your Content Audit & Mapping!</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">🎯 What You've Accomplished:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Audited existing content assets</li>
                      <li>✅ Mapped content to marketing funnel stages</li>
                      <li>✅ Identified content gaps and opportunities</li>
                      <li>✅ Created strategic content distribution plan</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">🚀 How This Impacts Your Success:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>📈 <strong>Step 3:</strong> Content strategy guides lead generation</li>
                      <li>🎯 <strong>Step 4:</strong> Funnel mapping informs sales sequences</li>
                      <li>📧 <strong>Step 5:</strong> Content assets drive automation</li>
                      <li>🏗️ <strong>CSP Setup:</strong> Content strategy powers campaigns</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">🔗 Building Your Content Foundation:</h5>
                  <p className="text-blue-800 text-sm">
                    Your content audit and funnel mapping from this step become the strategic backbone of your authority-building system. Combined with your ideal client personas from Step 1, this content strategy will guide lead generation, sales funnels, and automated nurture sequences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Please complete the previous steps to unlock this section.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 2 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Content Audit & Mapping
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Organize your content and map it to the customer journey.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 2 Complete! Your content is strategically mapped.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a clear content strategy aligned with your customer journey.
              </p>
            </div>
          </div>
        )}

        {/* Component 4: How This Works Section */}
        <div className={`rounded-lg shadow-lg border border-gray-200 mb-6 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2 ${isHowThisWorksOpen ? 'bg-white' : 'bg-white'}`}>
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#0e9246] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">How This Step Works</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#0e9246] font-medium">Expand</span>
              {isHowThisWorksOpen ? (
                <ChevronUp className="w-5 h-5 text-[#0e9246]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#0e9246]" />
              )}
            </div>
          </button>

          {isHowThisWorksOpen && (
            <div className="px-6 pb-6">
              <p className="text-gray-600 mb-6">{howThisWorksContent.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {howThisWorksContent.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Component 5: Sub-step Navigation */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Steps</h3>
          <p className="text-gray-600 mb-6">Complete all Action Steps below before moving to the next Step page.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {subSteps.map((step) => {
              const isActive = activeSubStep === step.id;
              const isCompleted = step.id < activeSubStep;
              const isUnlocked = isSubStepUnlocked(step.id);
              
              return (
                <button
                  key={step.id}
                  onClick={() => isUnlocked && setActiveSubStep(step.id)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                    isActive
                      ? 'border-[#fbae42] bg-[#fbae42] text-white shadow-lg'
                      : isCompleted
                      ? 'border-[#0e9246] bg-[#0e9246] text-white'
                      : isUnlocked
                      ? 'border-gray-300 bg-white text-gray-700 hover:border-[#fbae42] hover:bg-orange-50'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-[#0e9246] text-white'
                        : isActive
                        ? 'bg-[#fbae42] text-white'
                        : isUnlocked
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : !isUnlocked ? (
                        <span className="text-sm">🔒</span>
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive
                        ? 'text-[#fbae42]'
                        : isUnlocked
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-step Content */}
        <div className="mb-8">
          {renderSubStepContent()}
        </div>

        {/* Add Content Modal */}
        {addContentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Content Asset</h3>
                <button
                  onClick={() => setAddContentModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={newContentForm.title}
                    onChange={(e) => setNewContentForm({...newContentForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="Content title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={newContentForm.type}
                    onChange={(e) => setNewContentForm({...newContentForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select type</option>
                    <option value="Blog Post">Blog Post</option>
                    <option value="Video">Video</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Lead Magnet">Lead Magnet</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Email">Email</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newContentForm.description}
                    onChange={(e) => setNewContentForm({...newContentForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="Brief description of the content"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="url"
                    value={newContentForm.url}
                    onChange={(e) => setNewContentForm({...newContentForm, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="https://..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setAddContentModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContent}
                    className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-[#0c7a3a]"
                  >
                    Add Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title={aiResult?.type === 'placement' ? "AI Content Placement Suggestions" : "AI Gap Analysis"}
          content={aiResult}
          isLoading={aiLoading}
          onUseContent={() => {}}
        />

        {/* API Key Modal */}
        <APIKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSave={() => {}}
        />

        {/* Footer */}
        <StepFooter 
          currentStep={2}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step2;

