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
      case 0: return true; // Content Library always unlocked
      case 1: return hasCompletedGapAnalysis; // Marketing Copy unlocked when gaps filled
      case 2: return hasMarketingCopy; // Milestone unlocked when copy is done
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasCompletedGapAnalysis; // Content Library completed when gaps filled
      case 1: return hasMarketingCopy; // Marketing Copy completed when copy exists
      case 2: return isStepComplete; // Milestone completed when everything is done
      default: return false;
    }
  };

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

### Social Proof Elements:
"This system completely transformed how we approach our business. In just 6 months, we saw a 200% increase in qualified leads." - Sarah Johnson, CEO

---

## AUTHORITY - Establishing Credibility and Thought Leadership

### Authority-Building Headlines:
• "The #1 Framework for Business Transformation"
• "Featured in Forbes, Entrepreneur, and Inc. Magazine"
• "Trusted by Fortune 500 Companies"

### Authority-Building Copy:
As a recognized leader in business transformation, our approach has been featured in major publications and adopted by companies ranging from startups to Fortune 500 enterprises.

**Credentials & Recognition:**
- Keynote speaker at 50+ industry conferences
- Author of bestselling business transformation guide
- Consultant to top-tier organizations worldwide

### Thought Leadership Content:
Our proprietary TARE framework represents years of research, testing, and refinement. It's not just another business methodology—it's a complete system for sustainable growth.

---

## RAPPORT - Creating Connection Through Shared Values

### Rapport-Building Headlines:
• "We Understand the Challenges You Face"
• "Built by Entrepreneurs, for Entrepreneurs"
• "Your Success Is Our Mission"

### Rapport-Building Copy:
We've been where you are. The late nights wondering if your business will succeed. The frustration of trying system after system without results. The dream of building something that truly makes a difference.

**Our Story:**
Founded by entrepreneurs who experienced the same struggles you face today, our company was born from a simple belief: every business owner deserves access to proven systems that actually work.

### Value Alignment:
- Integrity in every interaction
- Transparency in our processes  
- Commitment to your long-term success
- Focus on sustainable, ethical growth

---

## ENGAGEMENT - Driving Action Through Compelling Calls-to-Action

### High-Converting CTAs:
• "Get Your Free Business Assessment"
• "Schedule Your Strategy Session Today"
• "Download the Complete Implementation Guide"
• "Join 1000+ Successful Business Owners"

### Engagement-Driving Copy:
Don't let another year pass wondering "what if." The business transformation you've been seeking is within reach. Our proven system has helped hundreds of entrepreneurs just like you achieve breakthrough results.

**Limited-Time Opportunity:**
For the next 48 hours, we're offering complimentary strategy sessions to qualified business owners. This is your chance to get personalized insights and a custom roadmap for your business growth.

### Urgency & Scarcity Elements:
- Only 10 strategy sessions available this month
- Bonus materials expire at midnight Friday
- Early-bird pricing ends in 72 hours
- Limited spots in our next cohort

---

## CONTENT MAPPING TO CUSTOMER JOURNEY

### Discover Stage Content:
${funnelContent.discover.map(content => `• ${content.name} (${content.type})`).join('\n')}

### Resonate Stage Content:
${funnelContent.resonate.map(content => `• ${content.name} (${content.type})`).join('\n')}

### Envision Stage Content:
${funnelContent.envision.map(content => `• ${content.name} (${content.type})`).join('\n')}

### Trust Stage Content:
${funnelContent.trust.map(content => `• ${content.name} (${content.type})`).join('\n')}

### Authority Stage Content:
${funnelContent.authority.map(content => `• ${content.name} (${content.type})`).join('\n')}

---

## EMAIL SEQUENCES

### Welcome Series (5 emails):
1. "Welcome to Your Transformation Journey"
2. "The #1 Mistake Most Business Owners Make"
3. "Case Study: How Sarah Doubled Her Revenue"
4. "Your Personalized Action Plan"
5. "Ready for the Next Step?"

### Nurture Series (7 emails):
1. "The Hidden Costs of Staying Where You Are"
2. "3 Signs You're Ready for Change"
3. "Behind the Scenes: Our Proven Process"
4. "Client Spotlight: From Struggle to Success"
5. "The Science Behind Our Methodology"
6. "What Makes Us Different"
7. "Your Invitation to Transform"

---

## SOCIAL MEDIA COPY

### LinkedIn Posts:
"The biggest mistake I see business owners make? Trying to do everything themselves. Here's why delegation is the key to scaling..."

### Facebook Posts:
"Just helped another client achieve a 150% revenue increase. Want to know the 3 strategies that made it possible?"

### Instagram Captions:
"Success isn't about working harder—it's about working smarter. Here's how we help business owners reclaim their time while growing their revenue..."

---

## LANDING PAGE COPY

### Hero Section:
**Headline:** "Transform Your Business in 90 Days or Less"
**Subheadline:** "Join 500+ entrepreneurs who've used our proven system to double their revenue and reclaim their freedom"
**CTA:** "Get Your Free Strategy Session"

### Benefits Section:
✓ Increase revenue by 50-200% in 90 days
✓ Build systems that run without you
✓ Attract high-quality clients consistently
✓ Scale without burning out

### Testimonials:
"This program gave me my life back. I went from working 80-hour weeks to 40 hours while doubling my income." - Mike Chen, Business Owner

---

*Generated based on your ${Object.values(funnelContent).flat().length} content pieces and TARE framework analysis.*`;

      setMarketingCopy(copy);
      setIsAiLoading(false);
    }, 3000);
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Organize your existing content and map it to the customer journey for maximum impact.",
    steps: [
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
        description: "Generate comprehensive TARE framework copy",
        color: "bg-[#fbae42]"
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
              <span className="text-sm text-[#0e9246] font-medium">
                {isHowThisWorksOpen ? 'Collapse' : 'Expand'}
              </span>
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
              const isCompleted = isSubStepCompleted(step.id);

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

        {/* Sub-step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Current Sub-step */}
          <div className="space-y-6">
            {activeSubStep === 0 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Library</h3>
                <p className="text-gray-600 mb-6">Drag items to the funnel or use AI to help.</p>
                
                {/* Section 1: Add New Content Asset */}
                <div className="mb-8">
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
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#d7df21] rounded-full flex items-center justify-center mr-3">
                      <span className="text-black text-sm font-bold">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">AI Placement Suggestions</h4>
                  </div>
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

                {/* Content Library Display */}
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

                {/* Gap Analysis Button */}
                {hasPlacedContent && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-[#d7df21] rounded-full flex items-center justify-center mr-3">
                        <span className="text-black text-sm font-bold">3</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">AI Gap Analysis</h4>
                    </div>
                    <button
                      onClick={handleGapAnalysis}
                      className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                    >
                      <Target className="w-5 h-5" />
                      <span>AI Gap Analysis</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 1 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Copy & TARE</h3>
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
                    <div className="text-sm text-gray-600 whitespace-pre-line max-h-96 overflow-y-auto">
                      {marketingCopy.substring(0, 500)}...
                    </div>
                    <button
                      onClick={() => setMarketingCopyModalOpen(true)}
                      className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                    >
                      View Full Copy →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">Congratulations! You've completed your content audit and mapping.</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What You've Accomplished:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Built your content library ({Object.values(funnelContent).flat().length} pieces)</li>
                      <li>✅ Mapped content to funnel stages</li>
                      <li>✅ Identified and filled content gaps</li>
                      <li>✅ Generated comprehensive marketing copy</li>
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

          {/* Right Column - Funnel Content Goal (only show during sub-step 1) */}
          {activeSubStep === 0 && (
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
                            className="px-3 py-1 bg-[#fbae42] text-white text-sm rounded hover:bg-[#e09d3a]"
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
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{marketingCopy}</pre>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(marketingCopy);
                          alert('Marketing copy copied to clipboard!');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
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

