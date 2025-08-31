import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, TestTube, BarChart, Target, TrendingUp, Activity, Edit, Trash2, Zap } from 'lucide-react';

const Step8 = () => {
  // Sub-step management (4 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [abTestingStrategy, setAbTestingStrategy] = useState(null);
  const [conversionTracking, setConversionTracking] = useState(null);
  const [optimizationPlan, setOptimizationPlan] = useState(null);
  
  // Modal states
  const [aiTestingModalOpen, setAiTestingModalOpen] = useState(false);
  const [addTestModalOpen, setAddTestModalOpen] = useState(false);
  const [aiTrackingModalOpen, setAiTrackingModalOpen] = useState(false);
  const [aiOptimizationModalOpen, setAiOptimizationModalOpen] = useState(false);
  
  // Form states
  const [testForm, setTestForm] = useState({
    name: '',
    hypothesis: '',
    element: '',
    variation: '',
    metric: '',
    duration: ''
  });
  
  // AI results
  const [aiTestingSuggestions, setAiTestingSuggestions] = useState([]);
  const [aiTrackingSuggestion, setAiTrackingSuggestion] = useState(null);
  const [aiOptimizationSuggestion, setAiOptimizationSuggestion] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration (4 steps total)
  const subSteps = [
    { id: 0, title: 'A/B Testing Strategy', completed: false },
    { id: 1, title: 'Conversion Tracking Setup', completed: false },
    { id: 2, title: 'Optimization Action Plan', completed: false },
    { id: 3, title: 'Milestone Reflection', completed: false }
  ];

  // Check completion status
  const hasTestingStrategy = abTestingStrategy !== null && abTestingStrategy.tests && abTestingStrategy.tests.length > 0;
  const hasConversionTracking = conversionTracking !== null;
  const hasOptimizationPlan = optimizationPlan !== null;
  const isStepComplete = hasTestingStrategy && hasConversionTracking && hasOptimizationPlan;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 0: return true; // A/B Testing Strategy always unlocked
      case 1: return hasTestingStrategy; // Conversion Tracking unlocked when strategy exists
      case 2: return hasConversionTracking; // Optimization Plan unlocked when tracking exists
      case 3: return hasOptimizationPlan; // Milestone unlocked when plan exists
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasTestingStrategy; // Testing completed when strategy exists
      case 1: return hasConversionTracking; // Tracking completed when setup exists
      case 2: return hasOptimizationPlan; // Optimization completed when plan exists
      case 3: return isStepComplete; // Milestone completed when everything is done
      default: return false;
    }
  };

  // Generate AI A/B Testing Strategy
  const handleAITestingStrategy = () => {
    setIsAiLoading(true);
    setAiTestingModalOpen(true);

    // Simulate AI testing strategy generation
    setTimeout(() => {
      const testingSuggestions = [
        {
          name: 'Landing Page Headline Test',
          hypothesis: 'A more specific, benefit-focused headline will increase conversion rates',
          element: 'Main headline on landing page',
          variation: 'Change from "Transform Your Business" to "Generate $10K+ Monthly Revenue in 90 Days"',
          metric: 'Landing page conversion rate',
          duration: '2 weeks',
          priority: 'High',
          reasoning: 'Headlines are the first thing visitors see and have the highest impact on conversions'
        },
        {
          name: 'Call-to-Action Button Test',
          hypothesis: 'A more action-oriented CTA will increase click-through rates',
          element: 'Primary CTA button',
          variation: 'Change from "Learn More" to "Get My Free Strategy Session"',
          metric: 'Button click-through rate',
          duration: '1 week',
          priority: 'High',
          reasoning: 'CTA buttons are critical conversion points and easy to test'
        },
        {
          name: 'Social Proof Placement Test',
          hypothesis: 'Testimonials above the fold will increase trust and conversions',
          element: 'Testimonial section placement',
          variation: 'Move testimonials from bottom to directly under headline',
          metric: 'Time on page and conversion rate',
          duration: '2 weeks',
          priority: 'Medium',
          reasoning: 'Social proof early in the page can build immediate trust'
        },
        {
          name: 'Lead Magnet Offer Test',
          hypothesis: 'A more specific lead magnet will attract higher quality leads',
          element: 'Lead magnet description',
          variation: 'Change from "Free Guide" to "The 7-Figure Authority Blueprint"',
          metric: 'Lead quality score and conversion rate',
          duration: '3 weeks',
          priority: 'Medium',
          reasoning: 'Specific offers tend to attract more qualified prospects'
        },
        {
          name: 'Email Subject Line Test',
          hypothesis: 'Personalized subject lines will increase email open rates',
          element: 'Email subject lines',
          variation: 'Add recipient name and specific benefit to subject lines',
          metric: 'Email open rate',
          duration: '1 week',
          priority: 'Medium',
          reasoning: 'Email open rates directly impact nurture sequence effectiveness'
        },
        {
          name: 'Pricing Display Test',
          hypothesis: 'Showing value comparison will increase perceived value',
          element: 'Pricing section',
          variation: 'Add "Value: $50,000" above "$5,000" price',
          metric: 'Pricing page conversion rate',
          duration: '2 weeks',
          priority: 'High',
          reasoning: 'Value anchoring can significantly impact pricing perception'
        }
      ];

      setAiTestingSuggestions(testingSuggestions);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI Testing Strategy
  const useAITestingStrategy = () => {
    if (!aiTestingSuggestions.length) return;
    
    setAbTestingStrategy({
      id: Date.now(),
      tests: aiTestingSuggestions,
      methodology: 'One test at a time with statistical significance',
      tools: ['Google Optimize', 'Hotjar', 'Google Analytics', 'Unbounce'],
      schedule: 'Run tests for minimum 1-2 weeks or until statistical significance'
    });
    
    setAiTestingModalOpen(false);
  };

  // Add Individual Test
  const addIndividualTest = (test) => {
    const currentTests = abTestingStrategy?.tests || [];
    const newTest = { ...test, id: Date.now() };
    
    setAbTestingStrategy({
      id: abTestingStrategy?.id || Date.now(),
      tests: [...currentTests, newTest],
      methodology: abTestingStrategy?.methodology || 'One test at a time with statistical significance',
      tools: abTestingStrategy?.tools || ['Google Optimize', 'Hotjar', 'Google Analytics'],
      schedule: abTestingStrategy?.schedule || 'Run tests for minimum 1-2 weeks'
    });
  };

  // Generate AI Conversion Tracking
  const handleAIConversionTracking = () => {
    setIsAiLoading(true);
    setAiTrackingModalOpen(true);

    // Simulate AI tracking setup generation
    setTimeout(() => {
      const tracking = {
        setup: 'Comprehensive Conversion Tracking System',
        description: 'Complete tracking setup for measuring and optimizing conversion performance',
        trackingEvents: [
          {
            event: 'Landing Page View',
            tool: 'Google Analytics',
            setup: 'Page view tracking with UTM parameters',
            purpose: 'Measure traffic sources and page performance'
          },
          {
            event: 'Lead Magnet Download',
            tool: 'Google Analytics + CRM',
            setup: 'Goal conversion tracking with form submissions',
            purpose: 'Track lead generation effectiveness'
          },
          {
            event: 'Email Open & Click',
            tool: 'Email platform + Google Analytics',
            setup: 'UTM tracking on all email links',
            purpose: 'Measure email engagement and nurture effectiveness'
          },
          {
            event: 'Discovery Call Booking',
            tool: 'Calendly + Google Analytics',
            setup: 'Goal tracking for calendar bookings',
            purpose: 'Track sales funnel progression'
          },
          {
            event: 'Proposal Sent',
            tool: 'CRM + Google Analytics',
            setup: 'Custom event tracking for proposal delivery',
            purpose: 'Monitor sales process efficiency'
          },
          {
            event: 'Client Conversion',
            tool: 'CRM + Google Analytics',
            setup: 'Revenue goal tracking with transaction values',
            purpose: 'Measure final conversion and revenue attribution'
          }
        ],
        tools: [
          'Google Analytics 4 for comprehensive tracking',
          'Google Tag Manager for event management',
          'Hotjar for user behavior analysis',
          'CRM integration (HubSpot, Pipedrive, etc.)',
          'Email platform tracking (Mailchimp, ConvertKit)',
          'Calendar booking tracking (Calendly, Acuity)'
        ],
        implementation: [
          'Install Google Analytics 4 and Google Tag Manager',
          'Set up conversion goals for each funnel stage',
          'Configure UTM parameters for all traffic sources',
          'Integrate CRM with analytics for complete attribution',
          'Set up custom events for key user actions',
          'Create conversion tracking dashboard'
        ]
      };

      setAiTrackingSuggestion(tracking);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI Tracking Suggestion
  const useAITrackingSuggestion = () => {
    if (!aiTrackingSuggestion) return;
    
    setConversionTracking({
      id: Date.now(),
      setup: aiTrackingSuggestion.setup,
      description: aiTrackingSuggestion.description,
      trackingEvents: aiTrackingSuggestion.trackingEvents,
      tools: aiTrackingSuggestion.tools,
      implementation: aiTrackingSuggestion.implementation
    });
    
    setAiTrackingModalOpen(false);
  };

  // Generate AI Optimization Plan
  const handleAIOptimizationPlan = () => {
    setIsAiLoading(true);
    setAiOptimizationModalOpen(true);

    // Simulate AI optimization plan generation
    setTimeout(() => {
      const optimization = {
        plan: '90-Day Conversion Optimization Action Plan',
        description: 'Systematic approach to testing and optimizing your conversion funnel',
        phases: [
          {
            phase: 'Phase 1: Foundation Testing (Days 1-30)',
            focus: 'High-impact, easy-to-implement tests',
            tests: [
              'Landing page headline optimization',
              'Call-to-action button text and color',
              'Lead magnet offer and positioning',
              'Email subject line variations'
            ],
            expectedImpact: '15-25% improvement in conversion rates',
            timeline: 'Run 2 tests simultaneously, 2 weeks each'
          },
          {
            phase: 'Phase 2: Content Testing (Days 31-60)',
            focus: 'Content and messaging optimization',
            tests: [
              'Social proof placement and format',
              'Value proposition clarity',
              'Objection handling content',
              'Testimonial selection and display'
            ],
            expectedImpact: '10-20% improvement in engagement',
            timeline: 'Run 1-2 tests per week, measure for 2 weeks each'
          },
          {
            phase: 'Phase 3: Advanced Testing (Days 61-90)',
            focus: 'Advanced funnel and process optimization',
            tests: [
              'Multi-step vs single-step forms',
              'Pricing presentation and anchoring',
              'Discovery call scheduling flow',
              'Follow-up sequence timing'
            ],
            expectedImpact: '5-15% improvement in qualified leads',
            timeline: 'Run complex tests for 3-4 weeks each'
          }
        ],
        methodology: [
          'Test only ONE element at a time',
          'Run tests until statistical significance (minimum 100 conversions per variation)',
          'Document all test results and learnings',
          'Implement winning variations before starting new tests',
          'Focus on high-traffic, high-impact areas first',
          'Use 95% confidence level for decision making'
        ],
        tools: [
          'Google Optimize for A/B testing',
          'Hotjar for user behavior analysis',
          'Google Analytics for conversion tracking',
          'Unbounce for landing page testing',
          'Mailchimp for email testing',
          'Calendly for booking flow optimization'
        ],
        successMetrics: [
          'Overall conversion rate improvement',
          'Cost per acquisition reduction',
          'Lead quality score increase',
          'Customer lifetime value growth',
          'Email engagement improvement',
          'Sales cycle reduction'
        ]
      };

      setAiOptimizationSuggestion(optimization);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI Optimization Suggestion
  const useAIOptimizationSuggestion = () => {
    if (!aiOptimizationSuggestion) return;
    
    setOptimizationPlan({
      id: Date.now(),
      plan: aiOptimizationSuggestion.plan,
      description: aiOptimizationSuggestion.description,
      phases: aiOptimizationSuggestion.phases,
      methodology: aiOptimizationSuggestion.methodology,
      tools: aiOptimizationSuggestion.tools,
      successMetrics: aiOptimizationSuggestion.successMetrics
    });
    
    setAiOptimizationModalOpen(false);
  };

  // Delete Test
  const deleteTest = (testId) => {
    if (abTestingStrategy) {
      setAbTestingStrategy({
        ...abTestingStrategy,
        tests: abTestingStrategy.tests.filter(test => test.id !== testId)
      });
    }
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Set up systematic A/B testing to optimize your conversion funnel one change at a time.",
    steps: [
      {
        title: "A/B Testing Strategy",
        description: "Plan your testing approach",
        color: "bg-[#0e9246]"
      },
      {
        title: "Conversion Tracking", 
        description: "Set up tracking systems",
        color: "bg-[#d7df21]"
      },
      {
        title: "Optimization Plan",
        description: "Create action plan for testing",
        color: "bg-[#fbae42]"
      },
      {
        title: "Milestone",
        description: "Complete optimization setup",
        color: "bg-[#467a8f]"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">STEP 8 OF 9</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Conversion Optimization
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Set up systematic A/B testing to optimize your conversion funnel one change at a time.
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <span className="text-sm font-bold">{step.id + 1}</span>
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
            {activeSubStep === 0 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">A/B Testing Strategy</h3>
                <p className="text-gray-600 mb-6">Plan your systematic approach to testing one change at a time for better results.</p>
                
                <div className="space-y-4 mb-6">
                  <button
                    onClick={handleAITestingStrategy}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Testing Strategy with AI</span>
                  </button>
                  
                  <button
                    onClick={() => setAddTestModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Manual Test</span>
                  </button>
                </div>

                {/* Testing Strategy Display */}
                {!abTestingStrategy || !abTestingStrategy.tests || abTestingStrategy.tests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No A/B tests planned yet</p>
                    <p className="text-sm">Start by generating AI suggestions or adding manual tests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Planned A/B Tests ({abTestingStrategy.tests.length})</h4>
                    {abTestingStrategy.tests.map((test, index) => (
                      <div key={test.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{test.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{test.hypothesis}</p>
                            <div className="text-xs text-gray-500 mt-2 space-y-1">
                              <p><span className="font-medium">Element:</span> {test.element}</p>
                              <p><span className="font-medium">Variation:</span> {test.variation}</p>
                              <p><span className="font-medium">Metric:</span> {test.metric}</p>
                              <div className="flex space-x-4 mt-1">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  test.priority === 'High' ? 'bg-red-100 text-red-800' :
                                  test.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {test.priority} Priority
                                </span>
                                <span>Duration: {test.duration}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-4">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteTest(test.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 1 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Conversion Tracking Setup</h3>
                <p className="text-gray-600 mb-6">Set up comprehensive tracking to measure the impact of your A/B tests.</p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleAIConversionTracking}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Tracking Setup with AI</span>
                  </button>
                </div>

                {conversionTracking && (
                  <div className="mt-6 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{conversionTracking.setup}</h4>
                    <p className="text-sm text-gray-600 mb-3">{conversionTracking.description}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• {conversionTracking.trackingEvents?.length || 0} tracking events</p>
                      <p>• {conversionTracking.tools?.length || 0} integrated tools</p>
                      <p>• Complete implementation guide</p>
                    </div>
                    <button
                      onClick={() => setAiTrackingModalOpen(true)}
                      className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                    >
                      View Full Tracking Setup →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimization Action Plan</h3>
                <p className="text-gray-600 mb-6">Create a 90-day systematic testing plan to optimize your conversions.</p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleAIOptimizationPlan}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Optimization Plan with AI</span>
                  </button>
                </div>

                {optimizationPlan && (
                  <div className="mt-6 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{optimizationPlan.plan}</h4>
                    <p className="text-sm text-gray-600 mb-3">{optimizationPlan.description}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• {optimizationPlan.phases?.length || 0} testing phases over 90 days</p>
                      <p>• Systematic one-change-at-a-time approach</p>
                      <p>• Statistical significance requirements</p>
                    </div>
                    <button
                      onClick={() => setAiOptimizationModalOpen(true)}
                      className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                    >
                      View Full Optimization Plan →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 3 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">Congratulations! You've set up your complete conversion optimization system.</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What You've Accomplished:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Created A/B testing strategy with {abTestingStrategy?.tests?.length || 0} planned tests</li>
                      <li>✅ Set up comprehensive conversion tracking system</li>
                      <li>✅ Built 90-day optimization action plan</li>
                      <li>✅ Established systematic testing methodology</li>
                      <li>✅ Ready to optimize conversions one change at a time</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <p className="text-sm text-blue-800">
                      Move on to Step 9: Authority Amplification to maximize your market positioning and thought leadership.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Optimization Overview */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Optimization System Overview</h3>
            
            {/* Testing Strategy Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">A/B Testing Strategy</h4>
              {!abTestingStrategy || !abTestingStrategy.tests || abTestingStrategy.tests.length === 0 ? (
                <p className="text-gray-500 text-sm">No testing strategy created yet</p>
              ) : (
                <div className="space-y-2">
                  {abTestingStrategy.tests.slice(0, 3).map((test, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <TestTube className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900 text-sm">{test.name}</span>
                      </div>
                      <p className="text-xs text-blue-700">{test.element} | {test.duration}</p>
                    </div>
                  ))}
                  {abTestingStrategy.tests.length > 3 && (
                    <p className="text-xs text-gray-500">+ {abTestingStrategy.tests.length - 3} more tests</p>
                  )}
                </div>
              )}
            </div>

            {/* Tracking Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Conversion Tracking</h4>
              {!conversionTracking ? (
                <p className="text-gray-500 text-sm">No tracking setup created yet</p>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <BarChart className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">{conversionTracking.setup}</span>
                  </div>
                  <p className="text-sm text-green-700">{conversionTracking.trackingEvents?.length || 0} tracking events</p>
                  <p className="text-sm text-green-700">{conversionTracking.tools?.length || 0} integrated tools</p>
                </div>
              )}
            </div>

            {/* Optimization Plan Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Optimization Action Plan</h4>
              {!optimizationPlan ? (
                <p className="text-gray-500 text-sm">No optimization plan created yet</p>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Target className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="font-medium text-orange-900">{optimizationPlan.plan}</span>
                  </div>
                  <p className="text-sm text-orange-700">{optimizationPlan.phases?.length || 0} testing phases</p>
                  <p className="text-sm text-orange-700">90-day systematic approach</p>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Setup Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Testing Strategy</span>
                  <span className={`text-sm font-medium ${hasTestingStrategy ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasTestingStrategy ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Tracking</span>
                  <span className={`text-sm font-medium ${hasConversionTracking ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasConversionTracking ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Optimization Plan</span>
                  <span className={`text-sm font-medium ${hasOptimizationPlan ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasOptimizationPlan ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Testing Methodology */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">🧪 Testing Best Practices</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Test only ONE element at a time</li>
                <li>• Run tests for minimum 1-2 weeks</li>
                <li>• Wait for statistical significance</li>
                <li>• Document all results and learnings</li>
                <li>• Implement winners before new tests</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Testing Strategy Modal */}
        {aiTestingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI A/B Testing Strategy</h3>
                  <button
                    onClick={() => setAiTestingModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-recommended A/B tests for conversion optimization</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating testing strategy...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">Recommended A/B Tests ({aiTestingSuggestions.length})</h4>
                      <button
                        onClick={useAITestingStrategy}
                        className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                      >
                        Use All Tests
                      </button>
                    </div>
                    
                    {aiTestingSuggestions.map((test, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{test.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{test.hypothesis}</p>
                            <div className="text-xs text-gray-500 mt-2 space-y-1">
                              <p><span className="font-medium">Element:</span> {test.element}</p>
                              <p><span className="font-medium">Variation:</span> {test.variation}</p>
                              <p><span className="font-medium">Metric:</span> {test.metric}</p>
                              <p><span className="font-medium">Duration:</span> {test.duration}</p>
                              <p className="italic mt-2">{test.reasoning}</p>
                            </div>
                            <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                              test.priority === 'High' ? 'bg-red-100 text-red-800' :
                              test.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {test.priority} Priority
                            </span>
                          </div>
                          <button
                            onClick={() => addIndividualTest(test)}
                            className="ml-4 px-3 py-1 bg-[#0e9246] text-white text-sm rounded hover:bg-green-700"
                          >
                            Add Test
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

        {/* AI Tracking Modal */}
        {aiTrackingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Conversion Tracking Setup</h3>
                  <button
                    onClick={() => setAiTrackingModalOpen(false)}
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
                    <span className="ml-3 text-gray-600">Generating tracking setup...</span>
                  </div>
                ) : aiTrackingSuggestion && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{aiTrackingSuggestion.setup}</h4>
                      <p className="text-gray-600 mb-4">{aiTrackingSuggestion.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Tracking Events ({aiTrackingSuggestion.trackingEvents.length})</h4>
                      <div className="space-y-3">
                        {aiTrackingSuggestion.trackingEvents.map((event, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">{event.event}</h5>
                            <p className="text-sm text-gray-600 mt-1">{event.purpose}</p>
                            <div className="text-xs text-gray-500 mt-2">
                              <p><span className="font-medium">Tool:</span> {event.tool}</p>
                              <p><span className="font-medium">Setup:</span> {event.setup}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Required Tools</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiTrackingSuggestion.tools.map((tool, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                            • {tool}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Implementation Steps</h4>
                      <div className="space-y-2">
                        {aiTrackingSuggestion.implementation.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <span className="bg-[#0e9246] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-600">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const content = JSON.stringify(aiTrackingSuggestion, null, 2);
                      navigator.clipboard.writeText(content);
                      alert('Tracking setup copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={useAITrackingSuggestion}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Use This Setup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Optimization Plan Modal */}
        {aiOptimizationModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">90-Day Optimization Action Plan</h3>
                  <button
                    onClick={() => setAiOptimizationModalOpen(false)}
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
                    <span className="ml-3 text-gray-600">Generating optimization plan...</span>
                  </div>
                ) : aiOptimizationSuggestion && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{aiOptimizationSuggestion.plan}</h4>
                      <p className="text-gray-600 mb-4">{aiOptimizationSuggestion.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Testing Phases ({aiOptimizationSuggestion.phases.length})</h4>
                      <div className="space-y-4">
                        {aiOptimizationSuggestion.phases.map((phase, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">{phase.phase}</h5>
                            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Focus:</span> {phase.focus}</p>
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Tests:</span>
                              <ul className="list-disc list-inside ml-4 mt-1">
                                {phase.tests.map((test, testIndex) => (
                                  <li key={testIndex}>{test}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-xs text-gray-500">
                              <p><span className="font-medium">Expected Impact:</span> {phase.expectedImpact}</p>
                              <p><span className="font-medium">Timeline:</span> {phase.timeline}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Testing Methodology</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiOptimizationSuggestion.methodology.map((method, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                            • {method}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recommended Tools</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiOptimizationSuggestion.tools.map((tool, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                            • {tool}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Success Metrics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiOptimizationSuggestion.successMetrics.map((metric, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-blue-50 rounded p-2">
                            📈 {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const content = JSON.stringify(aiOptimizationSuggestion, null, 2);
                      navigator.clipboard.writeText(content);
                      alert('Optimization plan copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={useAIOptimizationSuggestion}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Use This Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Test Modal */}
        {addTestModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add A/B Test</h3>
                  <button
                    onClick={() => setAddTestModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Name *</label>
                  <input
                    type="text"
                    value={testForm.name}
                    onChange={(e) => setTestForm({...testForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Landing Page Headline Test"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hypothesis</label>
                  <textarea
                    value={testForm.hypothesis}
                    onChange={(e) => setTestForm({...testForm, hypothesis: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="2"
                    placeholder="What do you think will happen and why?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Element to Test</label>
                  <input
                    type="text"
                    value={testForm.element}
                    onChange={(e) => setTestForm({...testForm, element: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Main headline, CTA button, form fields"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variation</label>
                  <textarea
                    value={testForm.variation}
                    onChange={(e) => setTestForm({...testForm, variation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="2"
                    placeholder="Describe the change you want to test"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Success Metric</label>
                  <input
                    type="text"
                    value={testForm.metric}
                    onChange={(e) => setTestForm({...testForm, metric: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Conversion rate, click-through rate"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Duration</label>
                  <select
                    value={testForm.duration}
                    onChange={(e) => setTestForm({...testForm, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select duration</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="3 weeks">3 weeks</option>
                    <option value="4 weeks">4 weeks</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddTestModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!testForm.name) {
                      alert('Please enter test name');
                      return;
                    }
                    addIndividualTest({...testForm, id: Date.now(), priority: 'Medium'});
                    setTestForm({ name: '', hypothesis: '', element: '', variation: '', metric: '', duration: '' });
                    setAddTestModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Add Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step8;

