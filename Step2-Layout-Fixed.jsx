import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, Target, FileText, Lightbulb } from 'lucide-react';

const Step2 = () => {
  // Sub-step management (3 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
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

  // Sub-steps configuration (3 steps total)
  const subSteps = [
    { id: 0, title: 'Content Library', completed: false },
    { id: 1, title: 'Marketing Copy & TARE', completed: false },
    { id: 2, title: 'Milestone Reflection', completed: false }
  ];

  // Funnel stages with correct CSP brand colors
  const funnelStages = [
    { 
      id: 'discover', 
      title: 'Discover the Possibility', 
      color: 'bg-blue-100 border-blue-300', 
      textColor: 'text-blue-800',
      description: 'They become aware that a better way exists.'
    },
    { 
      id: 'resonate', 
      title: 'Resonate with the Mission', 
      color: 'bg-green-100 border-green-300', 
      textColor: 'text-green-800',
      description: 'They connect emotionally with your message and positioning.'
    },
    { 
      id: 'envision', 
      title: 'Envision Their Transformation', 
      color: 'bg-yellow-100 border-yellow-300', 
      textColor: 'text-yellow-800',
      description: 'They see the tangible results of working with you.'
    },
    { 
      id: 'trust', 
      title: 'Trust the Process', 
      color: 'bg-orange-100 border-orange-300', 
      textColor: 'text-orange-800',
      description: 'They gain confidence in your ability to deliver.'
    },
    { 
      id: 'authority', 
      title: 'Step Into Authority', 
      color: 'bg-purple-100 border-purple-300', 
      textColor: 'text-purple-800',
      description: 'They are ready to take action and invest.'
    }
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedContentLibrary = localStorage.getItem('step2_contentLibrary');
    const savedFunnelContent = localStorage.getItem('step2_funnelContent');
    const savedMarketingCopy = localStorage.getItem('step2_marketingCopy');
    
    if (savedContentLibrary) {
      setContentLibrary(JSON.parse(savedContentLibrary));
    }
    if (savedFunnelContent) {
      setFunnelContent(JSON.parse(savedFunnelContent));
    }
    if (savedMarketingCopy) {
      setMarketingCopy(savedMarketingCopy);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('step2_contentLibrary', JSON.stringify(contentLibrary));
  }, [contentLibrary]);

  useEffect(() => {
    localStorage.setItem('step2_funnelContent', JSON.stringify(funnelContent));
  }, [funnelContent]);

  useEffect(() => {
    localStorage.setItem('step2_marketingCopy', marketingCopy);
  }, [marketingCopy]);

  // Check if content has been placed in funnel
  const hasPlacedContent = Object.values(funnelContent).some(stage => stage.length > 0);

  // Add new content to library
  const handleAddContent = () => {
    if (newContentForm.name && newContentForm.type) {
      const newContent = {
        id: Date.now(),
        ...newContentForm
      };
      setContentLibrary(prev => [...prev, newContent]);
      setNewContentForm({ type: '', name: '', description: '', notes: '' });
      setAddContentModalOpen(false);
    }
  };

  // AI Placement Suggestions
  const handleAiPlacement = () => {
    setIsAiLoading(true);
    setAiPlacementModalOpen(true);

    // Simulate AI analysis
    setTimeout(() => {
      const suggestions = contentLibrary.map(content => ({
        contentId: content.id,
        contentName: content.name,
        contentType: content.type,
        suggestedStage: ['discover', 'resonate', 'envision', 'trust', 'authority'][Math.floor(Math.random() * 5)],
        reasoning: `Based on the content type "${content.type}" and name "${content.name}", this would work well to ${getStageReasoning(content.type)}.`
      }));
      
      setAiPlacementResults(suggestions);
      setIsAiLoading(false);
    }, 2000);
  };

  const getStageReasoning = (contentType) => {
    const reasonings = {
      'Blog Post': 'build awareness and establish thought leadership',
      'Video': 'create emotional connection and demonstrate expertise',
      'Webinar': 'showcase transformation and build trust',
      'Case Study': 'prove results and establish authority',
      'eBook': 'provide comprehensive value and capture leads',
      'Podcast': 'build personal connection and authority',
      'Infographic': 'simplify complex concepts and increase shareability',
      'Template': 'provide immediate value and demonstrate expertise',
      'Checklist': 'guide action and establish process authority',
      'Course': 'deliver comprehensive transformation'
    };
    return reasonings[contentType] || 'provide value to your audience';
  };

  // Apply AI placement suggestion
  const applyPlacementSuggestion = (suggestion) => {
    const content = contentLibrary.find(c => c.id === suggestion.contentId);
    if (content) {
      setFunnelContent(prev => ({
        ...prev,
        [suggestion.suggestedStage]: [...prev[suggestion.suggestedStage], content]
      }));
      
      // Remove from content library
      setContentLibrary(prev => prev.filter(c => c.id !== suggestion.contentId));
      
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
      const gaps = funnelStages
        .map(stage => {
          const currentCount = funnelContent[stage.id].length;
          const needed = Math.max(0, 2 - currentCount);
          
          if (needed > 0) {
            return {
              stageId: stage.id,
              stage: stage.title,
              currentCount,
              needed,
              suggestions: getGapSuggestions(stage.id, needed)
            };
          }
          return null;
        })
        .filter(gap => gap !== null);
      
      setGapAnalysisResults(gaps);
      setIsAiLoading(false);
    }, 2000);
  };

  // Get gap suggestions for a specific stage
  const getGapSuggestions = (stageId, count) => {
    const suggestions = {
      discover: [
        'Industry Trend Analysis Blog Post',
        'Problem Identification Infographic',
        'Market Research Video',
        'Pain Point Assessment Quiz',
        'Industry Statistics Report',
        'Competitor Analysis Guide'
      ],
      resonate: [
        'Brand Story Video',
        'Mission Statement Blog Post',
        'Values Alignment Quiz',
        'Customer Journey Map',
        'Behind-the-Scenes Content',
        'Purpose-Driven Case Study'
      ],
      envision: [
        'Transformation Case Study',
        'Before & After Showcase',
        'Success Story Video',
        'Results Infographic',
        'ROI Calculator',
        'Future State Visualization'
      ],
      trust: [
        'Client Testimonial Video',
        'Process Explanation Guide',
        'Credentials Showcase',
        'Methodology Breakdown',
        'Quality Assurance Checklist',
        'Expert Interview Podcast'
      ],
      authority: [
        'Free Strategy Session Offer',
        'Exclusive Consultation CTA',
        'Limited-Time Bonus Package',
        'VIP Access Invitation',
        'Premium Resource Library',
        'Executive Summary Report'
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

    // Simulate comprehensive marketing copy generation
    setTimeout(() => {
      const copy = `# COMPREHENSIVE MARKETING COPY & TARE FRAMEWORK

## TRUST - Building Confidence Through Proven Expertise

### Trust-Building Headlines:
• "Proven System Used by 500+ Business Owners"
• "Backed by 10+ Years of Real-World Results"
• "See Why Industry Leaders Choose Our Approach"

### Trust-Building Copy:
Our methodology isn't just theory—it's battle-tested in the real world. Over the past decade, we've helped hundreds of business owners transform their operations, increase revenue, and build sustainable growth systems.

**Client Success Metrics:**
- Average revenue increase: 147%
- Client retention rate: 94%
- Implementation success rate: 89%

---

## AUTHORITY - Establishing Market Leadership

### Authority Headlines:
• "The Industry's Most Comprehensive Growth System"
• "Recognized by [Industry Publication] as Top Solution"
• "Featured Speaker at 50+ Industry Events"

### Authority Copy:
When industry leaders need results, they turn to our proven framework. Our systematic approach has been featured in major publications, taught at industry conferences, and implemented by Fortune 500 companies.

**Recognition & Credentials:**
- Featured in [Industry Magazine], [Business Journal]
- Keynote speaker at [Major Conference]
- Certified by [Relevant Authority]
- Member of [Professional Association]

---

## RESULTS - Demonstrating Tangible Outcomes

### Results Headlines:
• "See Real Results in 90 Days or Less"
• "Guaranteed ROI or Your Money Back"
• "Join 1,000+ Successful Implementations"

### Results Copy:
Don't just take our word for it—see the measurable impact our clients achieve. From startups to established enterprises, our framework delivers consistent, predictable results.

**Case Study Highlights:**
- Company A: 300% revenue growth in 12 months
- Company B: Reduced costs by 40% while scaling
- Company C: Expanded to 3 new markets successfully

---

## EXPERTISE - Showcasing Deep Knowledge

### Expertise Headlines:
• "20+ Years of Industry Experience"
• "Trained Over 10,000 Professionals"
• "Developed Proprietary Methodology"

### Expertise Copy:
Our deep understanding of [your industry] comes from decades of hands-on experience, continuous learning, and real-world application. We don't just teach theory—we've lived it.

**Expertise Indicators:**
- Advanced certifications in [relevant areas]
- Published research and thought leadership
- Proprietary tools and frameworks
- Continuous education and development

---

## IMPLEMENTATION FRAMEWORK

### Phase 1: Assessment & Strategy (Weeks 1-2)
- Comprehensive business analysis
- Goal setting and KPI definition
- Custom strategy development

### Phase 2: Foundation Building (Weeks 3-6)
- System implementation
- Team training and onboarding
- Process optimization

### Phase 3: Execution & Optimization (Weeks 7-12)
- Active implementation support
- Performance monitoring
- Continuous improvement

---

## CALL-TO-ACTION VARIATIONS

### Urgency-Based:
"Limited spots available - Secure your transformation today"

### Value-Based:
"Invest in your future success - Start your journey now"

### Risk-Reversal:
"Try our system risk-free with our 90-day guarantee"

### Exclusivity:
"Join our select group of high-achieving clients"

---

## OBJECTION HANDLING

### "It's too expensive"
Response: "Consider the cost of staying where you are vs. the value of transformation"

### "I don't have time"
Response: "Our system is designed to save you time while delivering better results"

### "I'm not sure it will work for me"
Response: "That's exactly why we offer a comprehensive assessment and guarantee"

### "I need to think about it"
Response: "I understand - here's what other successful clients considered before deciding"

---

This comprehensive copy framework provides the foundation for all your marketing communications, sales conversations, and content creation efforts.`;

      setMarketingCopy(copy);
      setIsAiLoading(false);
    }, 3000);
  };

  // Remove content from funnel stage
  const removeFromFunnel = (stageId, contentId) => {
    const content = funnelContent[stageId].find(c => c.id === contentId);
    if (content) {
      // Add back to content library if it's not an AI suggestion
      if (content.type !== 'AI Suggestion') {
        setContentLibrary(prev => [...prev, content]);
      }
      
      // Remove from funnel
      setFunnelContent(prev => ({
        ...prev,
        [stageId]: prev[stageId].filter(c => c.id !== contentId)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Step 2: Content Audit & Mapping</h1>
          <p className="text-gray-600">Organize your content and map it to your customer journey for maximum impact.</p>
        </div>

        {/* How This Step Works */}
        <div className="mb-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">How This Step Works</h3>
            </div>
            {isHowThisWorksOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {isHowThisWorksOpen && (
            <div className="px-6 pb-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {[
                  {
                    title: "Content Library",
                    description: "Add content and get AI placement suggestions",
                    color: "bg-[#0e9246]"
                  },
                  {
                    title: "Gap Analysis", 
                    description: "Identify missing content opportunities",
                    color: "bg-[#d7df21]"
                  },
                  {
                    title: "Marketing Copy",
                    description: "Generate TARE framework messaging",
                    color: "bg-[#467a8f]"
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Steps Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {subSteps.map((step, index) => {
              const isCompleted = step.completed;
              const isActive = activeSubStep === step.id;
              const isUnlocked = step.id <= activeSubStep || isCompleted;

              return (
                <button
                  key={step.id}
                  onClick={() => isUnlocked && setActiveSubStep(step.id)}
                  disabled={!isUnlocked}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-[#0e9246] bg-[#0e9246] bg-opacity-10'
                      : isUnlocked
                      ? 'border-gray-300 bg-white hover:border-[#0e9246] hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-[#0e9246] text-white'
                        : isActive
                        ? 'bg-[#0e9246] text-white'
                        : isUnlocked
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : !isUnlocked ? (
                        <span className="text-xs">🔒</span>
                      ) : (
                        <span className="text-sm font-bold">{step.id + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive
                        ? 'text-[#0e9246]'
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

        {/* Main Content Area - Single Column Layout */}
        <div className="space-y-8">
          {/* Sub-step 1: Content Library */}
          {activeSubStep === 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Content Tools */}
              <div className="space-y-6">
                {/* Section 1: Add New Content Asset */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#0e9246] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Add New Content Asset</h4>
                  </div>
                  <button
                    onClick={() => setAddContentModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Content Asset</span>
                  </button>
                </div>

                {/* Section 2: AI Placement Suggestions */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#d7df21] rounded-full flex items-center justify-center mr-3">
                      <span className="text-black text-sm font-bold">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">AI Placement Suggestions</h4>
                  </div>
                  
                  {contentLibrary.length > 0 ? (
                    <button
                      onClick={handleAiPlacement}
                      className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>🧠 Get AI Placement Ideas</span>
                    </button>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Add content to your library to get AI placement suggestions</p>
                    </div>
                  )}

                  {/* AI Placement Results */}
                  {aiPlacementResults.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h5 className="font-medium text-gray-900">AI Recommendations:</h5>
                      {aiPlacementResults.map((result, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900">{result.contentName}</h6>
                              <p className="text-sm text-gray-600 mt-1">{result.reasoning}</p>
                            </div>
                            <div className="text-right ml-4">
                              <span className="text-xs text-gray-500">Recommended for:</span>
                              <div className="font-medium text-sm" style={{ color: funnelStages.find(s => s.id === result.suggestedStage)?.textColor }}>
                                {funnelStages.find(s => s.id === result.suggestedStage)?.title}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              onClick={() => applyPlacementSuggestion(result)}
                              className="px-4 py-2 bg-[#fbae42] text-white text-sm rounded-lg hover:bg-[#e09d3a]"
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

              {/* Right Column - Funnel Content Goal */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Funnel Content Goal</h3>
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
                      {stage.description}
                    </p>
                    
                    {funnelContent[stage.id].length > 0 ? (
                      <div className="space-y-2">
                        {funnelContent[stage.id].map((content) => (
                          <div key={content.id} className="bg-white bg-opacity-70 rounded p-2 flex justify-between items-center">
                            <div>
                              <span className="font-medium text-gray-900">{content.name}</span>
                              <span className="text-xs text-gray-600 ml-2">{content.type}</span>
                            </div>
                            <button
                              onClick={() => removeFromFunnel(stage.id, content.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-4 ${stage.textColor} opacity-60`}>
                        No content assigned
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {/* Sub-step 2: Marketing Copy & TARE - Single Column */}
          {activeSubStep === 1 && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Copy & TARE Framework</h3>
              <p className="text-gray-600 mb-6">Generate comprehensive marketing copy based on the TARE framework.</p>
              
              <button
                onClick={handleGenerateMarketingCopy}
                className="w-full mb-6 px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>Generate Marketing Copy</span>
              </button>

              {marketingCopy && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Generated Marketing Copy</h4>
                  <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{marketingCopy.substring(0, 500)}...</pre>
                  </div>
                  <button
                    onClick={() => setMarketingCopyModalOpen(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Full Copy →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sub-step 3: Milestone Reflection - Single Column like Step 1 */}
          {activeSubStep === 2 && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Step 2 Milestone Celebration!</h3>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-green-900">Congratulations! 🎊</h4>
                    <p className="text-green-800">You've completed your Content Audit & Mapping foundation!</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🎯</span>
                  <h4 className="text-lg font-semibold text-gray-900">What You've Accomplished:</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✅</span>
                    <span className="text-gray-700">Built comprehensive content library ({Object.values(funnelContent).flat().length} pieces)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✅</span>
                    <span className="text-gray-700">Mapped content to strategic funnel stages</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✅</span>
                    <span className="text-gray-700">Identified and filled critical content gaps</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✅</span>
                    <span className="text-gray-700">Generated TARE framework marketing copy</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🚀</span>
                  <h4 className="text-lg font-semibold text-gray-900">How This Impacts Your Success:</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1">📈</span>
                    <span className="text-gray-700"><strong>Step 3:</strong> Content strategy guides lead intelligence targeting</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-orange-500 mr-3 mt-1">🎯</span>
                    <span className="text-gray-700"><strong>Step 4:</strong> Mapped content powers signature funnel creation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">💼</span>
                    <span className="text-gray-700"><strong>Step 5:</strong> TARE copy drives sales pipeline messaging</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">⚙️</span>
                    <span className="text-gray-700"><strong>CSP Setup:</strong> Content library enables automated nurture sequences</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🏗️</span>
                  <h4 className="text-lg font-semibold text-blue-900">Building Your Authority Foundation:</h4>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  Your strategic content audit and mapping from this step becomes the backbone of your entire authority-building system. Combined with your ideal client personas from Step 1, this content foundation will drive targeted lead generation, personalized funnel experiences, and compelling sales conversations. Every piece of content now has a strategic purpose and placement in your customer journey.
                </p>
              </div>
            </div>
          )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select
                    value={newContentForm.type}
                    onChange={(e) => setNewContentForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select type...</option>
                    <option value="Blog Post">Blog Post</option>
                    <option value="Video">Video</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Case Study">Case Study</option>
                    <option value="eBook">eBook</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Infographic">Infographic</option>
                    <option value="Template">Template</option>
                    <option value="Checklist">Checklist</option>
                    <option value="Course">Course</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Name</label>
                  <input
                    type="text"
                    value={newContentForm.name}
                    onChange={(e) => setNewContentForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="Enter content name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newContentForm.description}
                    onChange={(e) => setNewContentForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="Brief description..."
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
                  className="flex-1 px-4 py-2 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a]"
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
                  <h3 className="text-xl font-semibold text-gray-900">AI Placement Suggestions</h3>
                  <button
                    onClick={() => setAiPlacementModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI recommendations for optimal content placement in your funnel</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Analyzing your content...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiPlacementResults.map((result, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-900">{result.contentName}</h6>
                            <p className="text-sm text-gray-600 mt-1">{result.reasoning}</p>
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-xs text-gray-500">Recommended for:</span>
                            <div className="font-medium text-sm" style={{ color: funnelStages.find(s => s.id === result.suggestedStage)?.textColor }}>
                              {funnelStages.find(s => s.id === result.suggestedStage)?.title}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => applyPlacementSuggestion(result)}
                            className="px-4 py-2 bg-[#fbae42] text-white text-sm rounded-lg hover:bg-[#e09d3a]"
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
                <p className="text-gray-600 mt-2">AI recommendations for missing content in your funnel stages</p>
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
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h5 className="font-medium text-gray-900">{gap.stage}</h5>
                            <p className="text-sm text-gray-600">
                              Current: {gap.currentCount} items | Needed: {gap.needed} more
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">Recommended for:</span>
                            <div className="font-medium text-sm" style={{ color: funnelStages.find(s => s.id === gap.stageId)?.textColor || '#000' }}>
                              {gap.stage}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {gap.suggestions.map((suggestion, suggestionIndex) => (
                            <div key={suggestionIndex} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h6 className="font-medium text-gray-900 mb-1">{suggestion}</h6>
                                  <p className="text-sm text-gray-600">
                                    This content will help fill the gap in your {gap.stage.toLowerCase()} stage.
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  onClick={() => {
                                    addGapSuggestion(gap.stageId, suggestion);
                                    // Remove this suggestion from the list
                                    setGapAnalysisResults(prev => 
                                      prev.map(g => 
                                        g.stageId === gap.stageId 
                                          ? {...g, suggestions: g.suggestions.filter((_, i) => i !== suggestionIndex)}
                                          : g
                                      ).filter(g => g.suggestions.length > 0)
                                    );
                                  }}
                                  className="px-4 py-2 bg-[#fbae42] text-white text-sm rounded-lg hover:bg-[#e09d3a]"
                                >
                                  Add to {gap.stage}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* More Ideas Button */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => {
                              // Generate more suggestions for this stage
                              setIsAiLoading(true);
                              setTimeout(() => {
                                const moreSuggestions = getGapSuggestions(gap.stageId, 3);
                                setGapAnalysisResults(prev => 
                                  prev.map(g => 
                                    g.stageId === gap.stageId 
                                      ? {...g, suggestions: [...g.suggestions, ...moreSuggestions]}
                                      : g
                                  )
                                );
                                setIsAiLoading(false);
                              }, 1500);
                            }}
                            className="w-full px-4 py-2 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>🧠 More Ideas for {gap.stage}</span>
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

        {/* Marketing Copy Modal */}
        {marketingCopyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
                    <span className="ml-3 text-gray-600">Generating comprehensive marketing copy...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{marketingCopy}</pre>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => navigator.clipboard.writeText(marketingCopy)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      >
                        Copy to Clipboard
                      </button>
                      <button
                        onClick={() => setMarketingCopyModalOpen(false)}
                        className="px-4 py-2 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a]"
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

        {/* Custom Step Footer */}
        <div className="mt-8 lg:mt-12 space-y-6 lg:space-y-8">
          {/* Navigation Buttons */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 lg:gap-0">
            <a 
              href="/step/1"
              className="text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center"
              style={{ backgroundColor: '#467a8f' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#3a6578'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#467a8f'}
            >
              <span className="text-sm lg:text-base">← Back to Step 1</span>
            </a>
            
            {/* Show orange "Continue To Step 3" button when on milestone reflection */}
            {activeSubStep === 2 ? (
              <a 
                href="/step/3"
                className="text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center"
                style={{ backgroundColor: '#fbae42' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e09d3a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#fbae42'}
              >
                <span className="text-sm lg:text-base">Continue To Step 3 →</span>
              </a>
            ) : (
              /* Show completion message when not on milestone */
              <div className="px-4 lg:px-6 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-500 text-center">
                <span className="text-sm lg:text-base">Complete all sub-steps to continue</span>
              </div>
            )}
          </div>
          
          {/* Copyright */}
          <div className="text-center py-4 lg:py-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm lg:text-base">
              © 2025 Cultivating Sales, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;

