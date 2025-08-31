import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, Target, FileText, Lightbulb } from 'lucide-react';

const Step2 = () => {
  // Sub-step management
  const [activeSubStep, setActiveSubStep] = useState(1);
  const [contentLibrary, setContentLibrary] = useState([]);
  const [funnelContent, setFunnelContent] = useState({
    discover: [],
    resonate: [],
    envision: [],
    trust: [],
    authority: []
  });
  const [marketingCopy, setMarketingCopy] = useState('');
  
  // Modal states
  const [addContentModalOpen, setAddContentModalOpen] = useState(false);
  const [aiPlacementModalOpen, setAiPlacementModalOpen] = useState(false);
  const [gapAnalysisModalOpen, setGapAnalysisModalOpen] = useState(false);
  const [marketingCopyModalOpen, setMarketingCopyModalOpen] = useState(false);
  
  // Form states
  const [newContentForm, setNewContentForm] = useState({
    type: '',
    name: '',
    description: '',
    notes: ''
  });
  
  // AI results
  const [aiPlacementResults, setAiPlacementResults] = useState([]);
  const [gapAnalysisResults, setGapAnalysisResults] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration
  const subSteps = [
    { id: 1, title: 'Content Library', icon: FileText },
    { id: 2, title: 'AI Placement', icon: Sparkles },
    { id: 3, title: 'Gap Analysis', icon: Target },
    { id: 4, title: 'Marketing Copy & TARE', icon: FileText },
    { id: 5, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  // Funnel stages
  const funnelStages = [
    { id: 'discover', title: 'Discover the Possibility', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800' },
    { id: 'resonate', title: 'Resonate with the Mission', color: 'bg-green-100 border-green-300', textColor: 'text-green-800' },
    { id: 'envision', title: 'Envision Their Transformation', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800' },
    { id: 'trust', title: 'Trust the Process', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800' },
    { id: 'authority', title: 'Step Into Authority', color: 'bg-purple-100 border-purple-300', textColor: 'text-purple-800' }
  ];

  // Content types (alphabetized)
  const contentTypes = [
    'Article', 'Audio Course', 'Blog Post', 'Book', 'Brochure', 'Case Study', 'Checklist', 
    'Community Post', 'Comparison Chart', 'Course', 'Demo Video', 'E-book', 'Email', 
    'FAQ Document', 'Flowchart', 'Guide', 'Infographic', 'Landing Page', 'Lead Magnet', 
    'PDF Document', 'Playlist', 'Podcast', 'Presentation', 'Quiz', 'Resource List', 
    'Sales Page', 'Social Media Post', 'Template', 'Testimonial Video', 'Tool', 
    'Training Video', 'Video', 'Webinar', 'White Paper', 'Workshop'
  ];

  // Check completion status
  const hasContentLibrary = contentLibrary.length > 0;
  const hasPlacedContent = Object.values(funnelContent).some(stage => stage.length > 0);
  const hasCompletedGapAnalysis = Object.values(funnelContent).every(stage => stage.length >= 2);
  const hasMarketingCopy = marketingCopy.length > 0;
  const isStepComplete = hasContentLibrary && hasPlacedContent && hasCompletedGapAnalysis && hasMarketingCopy;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 1: return true; // Content Library always unlocked
      case 2: return hasContentLibrary; // AI Placement unlocked when content exists
      case 3: return hasPlacedContent; // Gap Analysis unlocked when content is placed
      case 4: return hasCompletedGapAnalysis; // Marketing Copy unlocked when gaps filled
      case 5: return hasMarketingCopy; // Milestone unlocked when copy is done
      default: return false;
    }
  };

  // Auto-progression logic - only progress when user explicitly moves forward
  useEffect(() => {
    // Don't auto-progress - let user control when to move to next step
    // User should be able to add multiple content pieces before AI placement
  }, [hasContentLibrary, hasPlacedContent, hasCompletedGapAnalysis, hasMarketingCopy, activeSubStep]);

  // Add content to library
  const handleAddContent = () => {
    if (!newContentForm.type || !newContentForm.name) {
      alert('Please fill in content type and name');
      return;
    }

    const newContent = {
      id: Date.now(),
      type: newContentForm.type,
      name: newContentForm.name,
      description: newContentForm.description,
      notes: newContentForm.notes
    };

    setContentLibrary([...contentLibrary, newContent]);
    setNewContentForm({ type: '', name: '', description: '', notes: '' });
    setAddContentModalOpen(false);
  };

  // AI Placement Suggestions
  const handleAIPlacement = () => {
    if (contentLibrary.length === 0) {
      alert('Please add content to your library first');
      return;
    }

    setIsAiLoading(true);
    setAiPlacementModalOpen(true);

    // Simulate AI analysis
    setTimeout(() => {
      const suggestions = contentLibrary.map(content => {
        let suggestedStage, reasoning;
        
        // AI logic based on content type
        switch (content.type.toLowerCase()) {
          case 'blog post':
          case 'article':
          case 'infographic':
            suggestedStage = 'discover';
            reasoning = 'Blog posts and articles are perfect for top-of-funnel awareness, helping prospects discover new possibilities.';
            break;
          case 'case study':
          case 'testimonial video':
            suggestedStage = 'resonate';
            reasoning = 'Case studies and testimonials build emotional connection and show social proof.';
            break;
          case 'course':
          case 'demo video':
          case 'webinar':
            suggestedStage = 'envision';
            reasoning = 'Educational content helps prospects envision their transformation and see results.';
            break;
          case 'checklist':
          case 'template':
          case 'tool':
            suggestedStage = 'trust';
            reasoning = 'Practical tools and resources build confidence in your ability to deliver.';
            break;
          case 'brochure':
          case 'sales page':
          case 'landing page':
            suggestedStage = 'authority';
            reasoning = 'Sales materials position you as the authority and encourage action.';
            break;
          default:
            suggestedStage = 'discover';
            reasoning = 'This content type works well for initial awareness and discovery.';
        }

        return {
          contentId: content.id,
          contentName: content.name,
          contentType: content.type,
          suggestedStage,
          reasoning
        };
      });

      setAiPlacementResults(suggestions);
      setIsAiLoading(false);
    }, 2000);
  };

  // Apply AI placement suggestion
  const applyPlacementSuggestion = (suggestion) => {
    const content = contentLibrary.find(c => c.id === suggestion.contentId);
    if (content) {
      // Add to funnel
      setFunnelContent(prev => ({
        ...prev,
        [suggestion.suggestedStage]: [...prev[suggestion.suggestedStage], content]
      }));
      // Remove from library
      setContentLibrary(prev => prev.filter(c => c.id !== content.id));
      
      // Update AI results to remove this suggestion
      setAiPlacementResults(prev => prev.filter(r => r.contentId !== suggestion.contentId));
    }
  };

  // Gap Analysis
  const handleGapAnalysis = () => {
    setIsAiLoading(true);
    setGapAnalysisModalOpen(true);

    // Simulate AI gap analysis
    setTimeout(() => {
      const gaps = [];
      
      funnelStages.forEach(stage => {
        const currentCount = funnelContent[stage.id].length;
        if (currentCount < 2) {
          const suggestions = getGapSuggestions(stage.id, 2 - currentCount);
          gaps.push({
            stage: stage.title,
            stageId: stage.id,
            currentCount,
            needed: 2 - currentCount,
            suggestions
          });
        }
      });

      setGapAnalysisResults(gaps);
      setIsAiLoading(false);
    }, 2000);
  };

  // Get gap suggestions based on stage
  const getGapSuggestions = (stageId, count) => {
    const suggestions = {
      discover: [
        'The Hidden Cost of DIY Business Solutions',
        '5 Warning Signs Your Current Strategy is Failing',
        'Why Most Businesses Fail in Their First Year'
      ],
      resonate: [
        'My Journey from Struggle to Success',
        'The Mission Behind Our Approach',
        'Why We Do What We Do'
      ],
      envision: [
        'Your Transformation Blueprint',
        'Client Results: Before and After',
        '90-Day Success Roadmap'
      ],
      trust: [
        'Our Proven Process Explained',
        'Client Success: Business Owner Achieves Goals',
        'The Science Behind Our Method'
      ],
      authority: [
        'Ready to Transform Your Business?',
        'Schedule Your Strategy Session',
        'Take the Next Step Today'
      ]
    };

    return suggestions[stageId]?.slice(0, count) || [];
  };

  // Add gap suggestion to funnel
  const addGapSuggestion = (stageId, suggestionText) => {
    const newContent = {
      id: Date.now(),
      type: 'AI Suggestion',
      name: suggestionText,
      description: 'AI-generated content suggestion',
      notes: 'This content needs to be created'
    };

    setFunnelContent(prev => ({
      ...prev,
      [stageId]: [...prev[stageId], newContent]
    }));
  };

  // Generate Marketing Copy
  const handleGenerateMarketingCopy = () => {
    setIsAiLoading(true);
    setMarketingCopyModalOpen(true);

    // Simulate marketing copy generation
    setTimeout(() => {
      const copy = `# TARE Framework Marketing Copy

## TRUST
Building confidence through proven expertise and transparent processes.

## AUTHORITY  
Establishing credibility through thought leadership and industry recognition.

## RAPPORT
Creating connection through shared values and understanding.

## ENGAGEMENT
Driving action through compelling calls-to-action and clear next steps.

---

*Generated based on your content audit and funnel mapping.*`;

      setMarketingCopy(copy);
      setIsAiLoading(false);
    }, 2000);
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Organize your existing content and map it to the customer journey for maximum impact.",
    steps: [
      {
        title: "Content Library",
        description: "Catalog your existing content assets",
        color: "bg-blue-500"
      },
      {
        title: "AI Placement",
        description: "Get AI suggestions for funnel placement",
        color: "bg-green-500"
      },
      {
        title: "Gap Analysis",
        description: "Identify missing content opportunities",
        color: "bg-orange-500"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">STEP 2 OF 9</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Content Audit & Mapping
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Organize your content and map it to the customer journey.
          </p>
        </div>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 2 Complete! Your content is mapped and optimized.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a clear content strategy aligned with your customer journey.
              </p>
            </div>
          </div>
        )}

        {/* How This Works Section */}
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
            <div className="px-6 pb-6 bg-white border-t border-[#0e9246]">
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

        {/* Action Steps Navigation */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Action Steps</h2>
          <p className="text-sm text-gray-600">Complete all Action Steps below before moving to the next Step page.</p>
        </div>
        
        <div className="bg-[#467a8f] bg-opacity-10 rounded-lg shadow-lg border border-[#467a8f] border-opacity-20 mb-8 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
          <div className="flex flex-wrap">
            {subSteps.map((step) => {
              const isUnlocked = isSubStepUnlocked(step.id);
              const isActive = activeSubStep === step.id;
              const isCompleted = step.id < activeSubStep || (step.id === 5 && isStepComplete);

              return (
                <button
                  key={step.id}
                  onClick={() => isUnlocked && setActiveSubStep(step.id)}
                  disabled={!isUnlocked}
                  className={`flex-1 min-w-0 px-4 py-4 text-center border-b-2 transition-colors duration-200 ${
                    isActive
                      ? 'border-[#fbae42] bg-orange-50'
                      : isUnlocked
                      ? 'border-transparent hover:border-gray-300 hover:bg-white hover:bg-opacity-50'
                      : 'border-transparent bg-transparent'
                  } ${
                    !isUnlocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
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
                        <span className="text-xs">🔒</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Current Sub-step */}
          <div className="space-y-6">
            {activeSubStep === 1 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Library</h3>
                <p className="text-gray-600 mb-6">Drag items to the funnel or use AI to help.</p>
                
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setAddContentModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Content Asset</span>
                  </button>
                  
                  <button
                    onClick={handleAIPlacement}
                    disabled={contentLibrary.length === 0}
                    className={`w-full px-6 py-3 rounded-lg flex items-center justify-center space-x-2 ${
                      contentLibrary.length === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#d7df21] text-black hover:bg-[#c5cd1e]'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>AI Placement Suggestions</span>
                  </button>
                </div>

                {contentLibrary.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No unmapped content</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Your Content ({contentLibrary.length} items)</h4>
                    {contentLibrary.map((content) => (
                      <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{content.name}</h4>
                            <p className="text-sm text-gray-600">{content.type}</p>
                            {content.description && (
                              <p className="text-sm text-gray-500 mt-1">{content.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Placement Suggestions</h3>
                <p className="text-gray-600 mb-6">Get AI recommendations for where your content fits in the funnel.</p>
                
                <button
                  onClick={handleAIPlacement}
                  className="w-full mb-6 px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>AI Placement Suggestions</span>
                </button>

                {contentLibrary.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>Add content to your library first</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contentLibrary.map((content) => (
                      <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{content.name}</h4>
                        <p className="text-sm text-gray-600">{content.type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 3 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Gap Analysis</h3>
                <p className="text-gray-600 mb-6">Identify missing content for your funnel stages.</p>
                
                <button
                  onClick={handleGapAnalysis}
                  className="w-full mb-6 px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                >
                  <Target className="w-5 h-5" />
                  <span>AI Gap Analysis</span>
                </button>

                <div className="text-center py-12 text-gray-500">
                  <p>Goal: At least 2 content items per stage to start</p>
                </div>
              </div>
            )}

            {activeSubStep === 4 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Copy & TARE</h3>
                <p className="text-gray-600 mb-6">Generate marketing copy based on the TARE framework.</p>
                
                <button
                  onClick={handleGenerateMarketingCopy}
                  className="w-full mb-6 px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Generate Marketing Copy</span>
                </button>

                {marketingCopy && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Generated Marketing Copy</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-line">
                      {marketingCopy.substring(0, 200)}...
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 5 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">Congratulations! You've completed your content audit and mapping.</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What You've Accomplished:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Built your content library</li>
                      <li>✅ Mapped content to funnel stages</li>
                      <li>✅ Identified content gaps</li>
                      <li>✅ Generated marketing copy</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <p className="text-sm text-blue-800">
                      Move on to Step 3: Lead Intelligence to identify and attract your ideal prospects.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Funnel Content Goal */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Funnel Content Goal</h3>
              {activeSubStep >= 3 && (
                <button
                  onClick={handleGapAnalysis}
                  className="px-4 py-2 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] text-sm"
                >
                  AI Gap Analysis
                </button>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">Goal: At least 2 content items per stage to start.</p>
            
            <div className="space-y-4">
              {funnelStages.map((stage) => (
                <div key={stage.id} className={`border-2 border-dashed rounded-lg p-4 ${stage.color}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`font-medium ${stage.textColor}`}>{stage.title}</h4>
                    <span className={`text-sm ${stage.textColor}`}>
                      {funnelContent[stage.id].length} items
                    </span>
                  </div>
                  <p className={`text-sm ${stage.textColor} mb-3`}>
                    {stage.id === 'discover' && 'They become aware that a better way exists.'}
                    {stage.id === 'resonate' && 'They connect emotionally with your message and positioning.'}
                    {stage.id === 'envision' && 'They see the tangible results of working with you.'}
                    {stage.id === 'trust' && 'They gain confidence in your ability to deliver.'}
                    {stage.id === 'authority' && 'They are ready to take action and invest.'}
                  </p>
                  
                  {funnelContent[stage.id].length === 0 ? (
                    <div className={`text-center py-4 ${stage.textColor} opacity-60`}>
                      <p className="text-sm">No content assigned</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {funnelContent[stage.id].map((content) => (
                        <div key={content.id} className="bg-white bg-opacity-50 rounded p-2">
                          <p className="font-medium text-gray-900 text-sm">{content.name}</p>
                          <p className="text-xs text-gray-600">{content.type}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Content Modal */}
        {addContentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Content Asset</h3>
                  <button
                    onClick={() => setAddContentModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
                  <select
                    value={newContentForm.type}
                    onChange={(e) => setNewContentForm({...newContentForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select type</option>
                    {contentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Name *</label>
                  <input
                    type="text"
                    value={newContentForm.name}
                    onChange={(e) => setNewContentForm({...newContentForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="Enter content name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Description</label>
                  <textarea
                    value={newContentForm.description}
                    onChange={(e) => setNewContentForm({...newContentForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="Describe your content"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newContentForm.notes}
                    onChange={(e) => setNewContentForm({...newContentForm, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="2"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddContentModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContent}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Add Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Placement Modal */}
        {aiPlacementModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Content Placement Analysis</h3>
                  <button
                    onClick={() => setAiPlacementModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI analysis of your content with funnel stage placement</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Analyzing your content...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Content Analysis Results ({aiPlacementResults.length} items)</h4>
                    {aiPlacementResults.map((result, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{result.contentName}</h5>
                            <p className="text-sm text-gray-600">{result.contentType}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            result.suggestedStage === 'discover' ? 'bg-blue-100 text-blue-800' :
                            result.suggestedStage === 'resonate' ? 'bg-green-100 text-green-800' :
                            result.suggestedStage === 'envision' ? 'bg-yellow-100 text-yellow-800' :
                            result.suggestedStage === 'trust' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {funnelStages.find(s => s.id === result.suggestedStage)?.title}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-md p-3 mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">AI Recommendation:</span> {result.reasoning}
                          </p>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => applyPlacementSuggestion(result)}
                            className="px-3 py-1 bg-[#0e9246] text-white text-sm rounded hover:bg-green-700"
                          >
                            Add to {funnelStages.find(s => s.id === result.suggestedStage)?.title}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gap Analysis Modal */}
        {gapAnalysisModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Gap Analysis</h3>
                  <button
                    onClick={() => setGapAnalysisModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Identify missing content for incomplete funnel stages</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Analyzing content gaps...</span>
                  </div>
                ) : gapAnalysisResults.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h4 className="font-semibold text-gray-900 mb-2">No Gaps Found!</h4>
                    <p className="text-gray-600">All funnel stages have at least 2 content pieces.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {gapAnalysisResults.map((gap, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">{gap.stage}</h5>
                        <p className="text-sm text-gray-600 mb-4">
                          Current: {gap.currentCount} items | Needed: {gap.needed} more
                        </p>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">AI Suggestions:</p>
                          {gap.suggestions.map((suggestion, suggestionIndex) => (
                            <div key={suggestionIndex} className="flex justify-between items-center bg-gray-50 rounded p-3">
                              <span className="text-sm text-gray-700">{suggestion}</span>
                              <button
                                onClick={() => addGapSuggestion(gap.stageId, suggestion)}
                                className="px-3 py-1 bg-[#0e9246] text-white text-xs rounded hover:bg-green-700"
                              >
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Marketing Copy Modal */}
        {marketingCopyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Marketing Copy & TARE Framework</h3>
                  <button
                    onClick={() => setMarketingCopyModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating marketing copy...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">{marketingCopy}</pre>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setMarketingCopyModalOpen(false)}
                        className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                      >
                        Save Marketing Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2;

