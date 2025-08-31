import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, BarChart3, Layout, Calendar, Target, TrendingUp, Activity, Edit, Trash2 } from 'lucide-react';

const Step7 = () => {
  // Sub-step management (4 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [kpiPlan, setKpiPlan] = useState(null);
  const [dashboardLayout, setDashboardLayout] = useState(null);
  const [reportingSchedule, setReportingSchedule] = useState(null);
  
  // Modal states
  const [aiKpiModalOpen, setAiKpiModalOpen] = useState(false);
  const [addKpiModalOpen, setAddKpiModalOpen] = useState(false);
  const [aiDashboardModalOpen, setAiDashboardModalOpen] = useState(false);
  const [aiReportingModalOpen, setAiReportingModalOpen] = useState(false);
  
  // Form states
  const [kpiForm, setKpiForm] = useState({
    name: '',
    description: '',
    target: '',
    frequency: '',
    category: ''
  });
  
  // AI results
  const [aiKpiSuggestions, setAiKpiSuggestions] = useState([]);
  const [aiDashboardSuggestion, setAiDashboardSuggestion] = useState(null);
  const [aiReportingSuggestion, setAiReportingSuggestion] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration (4 steps total)
  const subSteps = [
    { id: 0, title: 'KPIs Planning', completed: false },
    { id: 1, title: 'Dashboard Layout', completed: false },
    { id: 2, title: 'Reporting Schedule', completed: false },
    { id: 3, title: 'Milestone Reflection', completed: false }
  ];

  // Check completion status
  const hasKpiPlan = kpiPlan !== null && kpiPlan.kpis && kpiPlan.kpis.length > 0;
  const hasDashboardLayout = dashboardLayout !== null;
  const hasReportingSchedule = reportingSchedule !== null;
  const isStepComplete = hasKpiPlan && hasDashboardLayout && hasReportingSchedule;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 0: return true; // KPIs Planning always unlocked
      case 1: return hasKpiPlan; // Dashboard unlocked when KPIs exist
      case 2: return hasDashboardLayout; // Reporting unlocked when dashboard exists
      case 3: return hasReportingSchedule; // Milestone unlocked when reporting exists
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasKpiPlan; // KPIs completed when plan exists
      case 1: return hasDashboardLayout; // Dashboard completed when layout exists
      case 2: return hasReportingSchedule; // Reporting completed when schedule exists
      case 3: return isStepComplete; // Milestone completed when everything is done
      default: return false;
    }
  };

  // Generate AI KPI Suggestions
  const handleAIKpiSuggestions = () => {
    setIsAiLoading(true);
    setAiKpiModalOpen(true);

    // Simulate AI KPI generation
    setTimeout(() => {
      const kpiSuggestions = [
        {
          name: 'Monthly Recurring Revenue (MRR)',
          description: 'Track predictable monthly revenue from recurring clients and programs',
          target: '$10,000/month',
          frequency: 'Monthly',
          category: 'Revenue',
          reasoning: 'Essential for measuring business growth and financial stability'
        },
        {
          name: 'Lead Conversion Rate',
          description: 'Percentage of leads that convert to paying clients',
          target: '15%',
          frequency: 'Weekly',
          category: 'Sales',
          reasoning: 'Critical for optimizing your sales process and lead quality'
        },
        {
          name: 'Content Engagement Rate',
          description: 'Average engagement across all content platforms (likes, shares, comments)',
          target: '5%',
          frequency: 'Weekly',
          category: 'Marketing',
          reasoning: 'Measures authority building and audience connection'
        },
        {
          name: 'Client Lifetime Value (CLV)',
          description: 'Average total revenue generated per client over their relationship',
          target: '$5,000',
          frequency: 'Quarterly',
          category: 'Revenue',
          reasoning: 'Helps optimize pricing and client retention strategies'
        },
        {
          name: 'Authority Score',
          description: 'Composite score based on speaking engagements, media mentions, and thought leadership',
          target: '75/100',
          frequency: 'Monthly',
          category: 'Authority',
          reasoning: 'Tracks your positioning and recognition in your industry'
        },
        {
          name: 'Pipeline Health Score',
          description: 'Percentage of sales pipeline that is actively progressing',
          target: '80%',
          frequency: 'Weekly',
          category: 'Sales',
          reasoning: 'Ensures consistent revenue flow and identifies bottlenecks'
        },
        {
          name: 'Client Satisfaction Score',
          description: 'Average satisfaction rating from client feedback surveys',
          target: '4.5/5',
          frequency: 'Monthly',
          category: 'Service',
          reasoning: 'Maintains service quality and identifies improvement opportunities'
        },
        {
          name: 'Lead Generation Rate',
          description: 'Number of qualified leads generated per month',
          target: '50 leads/month',
          frequency: 'Weekly',
          category: 'Marketing',
          reasoning: 'Ensures consistent pipeline flow and marketing effectiveness'
        }
      ];

      setAiKpiSuggestions(kpiSuggestions);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI KPI Suggestions
  const useAIKpiSuggestions = () => {
    if (!aiKpiSuggestions.length) return;
    
    setKpiPlan({
      id: Date.now(),
      kpis: aiKpiSuggestions,
      trackingMethod: 'Monthly KPI Review Dashboard',
      reviewFrequency: 'Monthly with quarterly deep dives'
    });
    
    setAiKpiModalOpen(false);
  };

  // Add Individual KPI
  const addIndividualKpi = (kpi) => {
    const currentKpis = kpiPlan?.kpis || [];
    const newKpi = { ...kpi, id: Date.now() };
    
    setKpiPlan({
      id: kpiPlan?.id || Date.now(),
      kpis: [...currentKpis, newKpi],
      trackingMethod: kpiPlan?.trackingMethod || 'Monthly KPI Review Dashboard',
      reviewFrequency: kpiPlan?.reviewFrequency || 'Monthly with quarterly deep dives'
    });
  };

  // Generate AI Dashboard Layout
  const handleAIDashboardLayout = () => {
    setIsAiLoading(true);
    setAiDashboardModalOpen(true);

    // Simulate AI dashboard generation
    setTimeout(() => {
      const dashboard = {
        layout: 'Executive Dashboard Layout',
        description: 'A comprehensive business intelligence dashboard designed for authority-based service providers',
        sections: [
          {
            title: 'Revenue Overview',
            position: 'Top Left',
            widgets: ['Monthly Revenue Chart', 'Revenue vs Target', 'Revenue Growth %'],
            purpose: 'Track financial performance and growth trends'
          },
          {
            title: 'Sales Pipeline',
            position: 'Top Right', 
            widgets: ['Pipeline Value', 'Conversion Rates', 'Deal Stages'],
            purpose: 'Monitor sales process health and opportunities'
          },
          {
            title: 'Authority Metrics',
            position: 'Middle Left',
            widgets: ['Content Engagement', 'Speaking Engagements', 'Media Mentions'],
            purpose: 'Track authority building and thought leadership'
          },
          {
            title: 'Client Success',
            position: 'Middle Right',
            widgets: ['Client Satisfaction', 'Retention Rate', 'Referral Rate'],
            purpose: 'Monitor service delivery and client relationships'
          },
          {
            title: 'Marketing Performance',
            position: 'Bottom Left',
            widgets: ['Lead Generation', 'Cost per Lead', 'Channel Performance'],
            purpose: 'Optimize marketing spend and lead quality'
          },
          {
            title: 'Operational Efficiency',
            position: 'Bottom Right',
            widgets: ['Project Completion Rate', 'Resource Utilization', 'Profit Margins'],
            purpose: 'Ensure efficient operations and profitability'
          }
        ],
        tools: [
          'Google Analytics for website traffic',
          'HubSpot CRM for sales pipeline',
          'Mailchimp for email marketing metrics',
          'Social media analytics (LinkedIn, Twitter)',
          'Financial tracking (QuickBooks or similar)',
          'Client feedback surveys (Typeform)',
          'Time tracking (Toggl or RescueTime)',
          'Project management (Asana or Monday.com)'
        ],
        updateFrequency: 'Real-time data with daily snapshots'
      };

      setAiDashboardSuggestion(dashboard);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI Dashboard Suggestion
  const useAIDashboardSuggestion = () => {
    if (!aiDashboardSuggestion) return;
    
    setDashboardLayout({
      id: Date.now(),
      layout: aiDashboardSuggestion.layout,
      description: aiDashboardSuggestion.description,
      sections: aiDashboardSuggestion.sections,
      tools: aiDashboardSuggestion.tools,
      updateFrequency: aiDashboardSuggestion.updateFrequency
    });
    
    setAiDashboardModalOpen(false);
  };

  // Generate AI Reporting Schedule
  const handleAIReportingSchedule = () => {
    setIsAiLoading(true);
    setAiReportingModalOpen(true);

    // Simulate AI reporting schedule generation
    setTimeout(() => {
      const reporting = {
        schedule: 'Comprehensive Reporting Schedule',
        description: 'Strategic reporting framework for authority-based businesses',
        reports: [
          {
            name: 'Daily Pulse Report',
            frequency: 'Daily',
            time: '9:00 AM',
            metrics: ['New leads', 'Revenue today', 'Content engagement', 'Pipeline updates'],
            audience: 'Business owner',
            format: 'Email summary (5 minutes to review)',
            purpose: 'Quick daily health check and priority setting'
          },
          {
            name: 'Weekly Performance Review',
            frequency: 'Weekly',
            time: 'Monday 10:00 AM',
            metrics: ['Weekly revenue', 'Lead conversion rates', 'Content performance', 'Client satisfaction'],
            audience: 'Business owner + team',
            format: 'Dashboard review + team meeting',
            purpose: 'Weekly planning and course correction'
          },
          {
            name: 'Monthly Business Review',
            frequency: 'Monthly',
            time: 'First Monday of month',
            metrics: ['Monthly revenue vs target', 'Authority metrics', 'Client retention', 'Marketing ROI'],
            audience: 'Business owner + advisors',
            format: 'Comprehensive report + strategy session',
            purpose: 'Strategic planning and goal adjustment'
          },
          {
            name: 'Quarterly Growth Analysis',
            frequency: 'Quarterly',
            time: 'First week of quarter',
            metrics: ['Quarterly growth', 'Market positioning', 'Competitive analysis', 'Strategic initiatives'],
            audience: 'Business owner + board/advisors',
            format: 'Executive presentation + planning retreat',
            purpose: 'Long-term strategy and major decision making'
          }
        ],
        automation: [
          'Automated data collection from all connected tools',
          'Scheduled report generation and distribution',
          'Alert system for metrics outside target ranges',
          'Monthly report compilation and formatting'
        ],
        tools: [
          'Google Data Studio for dashboard creation',
          'Zapier for data automation',
          'Slack for alert notifications',
          'Email automation for report distribution'
        ]
      };

      setAiReportingSuggestion(reporting);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI Reporting Suggestion
  const useAIReportingSuggestion = () => {
    if (!aiReportingSuggestion) return;
    
    setReportingSchedule({
      id: Date.now(),
      schedule: aiReportingSuggestion.schedule,
      description: aiReportingSuggestion.description,
      reports: aiReportingSuggestion.reports,
      automation: aiReportingSuggestion.automation,
      tools: aiReportingSuggestion.tools
    });
    
    setAiReportingModalOpen(false);
  };

  // Delete KPI
  const deleteKpi = (kpiId) => {
    if (kpiPlan) {
      setKpiPlan({
        ...kpiPlan,
        kpis: kpiPlan.kpis.filter(kpi => kpi.id !== kpiId)
      });
    }
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Set up your measurement and monitoring systems to track business performance and growth.",
    steps: [
      {
        title: "KPIs Planning",
        description: "Define key performance indicators",
        color: "bg-[#0e9246]"
      },
      {
        title: "Dashboard Layout", 
        description: "Design your monitoring dashboard",
        color: "bg-[#d7df21]"
      },
      {
        title: "Reporting Schedule",
        description: "Create automated reporting system",
        color: "bg-[#fbae42]"
      },
      {
        title: "Milestone",
        description: "Complete your measurement system",
        color: "bg-[#467a8f]"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">STEP 7 OF 9</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Metrics & Monitoring
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Set up systems to measure and monitor your business performance and growth.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">KPIs Planning</h3>
                <p className="text-gray-600 mb-6">Define the key performance indicators you'll track to measure business success.</p>
                
                <div className="space-y-4 mb-6">
                  <button
                    onClick={handleAIKpiSuggestions}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate KPIs with AI</span>
                  </button>
                  
                  <button
                    onClick={() => setAddKpiModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Manual KPI</span>
                  </button>
                </div>

                {/* KPI Display */}
                {!kpiPlan || !kpiPlan.kpis || kpiPlan.kpis.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No KPIs defined yet</p>
                    <p className="text-sm">Start by generating AI suggestions or adding manual KPIs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Your KPIs ({kpiPlan.kpis.length})</h4>
                    {kpiPlan.kpis.map((kpi, index) => (
                      <div key={kpi.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{kpi.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{kpi.description}</p>
                            <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{kpi.category}</span>
                              <span>Target: {kpi.target}</span>
                              <span>Track: {kpi.frequency}</span>
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-4">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteKpi(kpi.id)}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Layout</h3>
                <p className="text-gray-600 mb-6">Design your business intelligence dashboard for monitoring KPIs.</p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleAIDashboardLayout}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Dashboard with AI</span>
                  </button>
                </div>

                {dashboardLayout && (
                  <div className="mt-6 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{dashboardLayout.layout}</h4>
                    <p className="text-sm text-gray-600 mb-3">{dashboardLayout.description}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• {dashboardLayout.sections?.length || 0} dashboard sections</p>
                      <p>• {dashboardLayout.tools?.length || 0} integrated tools</p>
                      <p>• {dashboardLayout.updateFrequency}</p>
                    </div>
                    <button
                      onClick={() => setAiDashboardModalOpen(true)}
                      className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                    >
                      View Full Dashboard Layout →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Reporting Schedule</h3>
                <p className="text-gray-600 mb-6">Create your automated reporting schedule and distribution system.</p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleAIReportingSchedule}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Reporting Schedule with AI</span>
                  </button>
                </div>

                {reportingSchedule && (
                  <div className="mt-6 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{reportingSchedule.schedule}</h4>
                    <p className="text-sm text-gray-600 mb-3">{reportingSchedule.description}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• {reportingSchedule.reports?.length || 0} automated reports</p>
                      <p>• Daily, weekly, monthly, and quarterly schedules</p>
                      <p>• Automated data collection and distribution</p>
                    </div>
                    <button
                      onClick={() => setAiReportingModalOpen(true)}
                      className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                    >
                      View Full Reporting Schedule →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 3 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">Congratulations! You've set up your complete measurement and monitoring system.</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What You've Accomplished:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Defined {kpiPlan?.kpis?.length || 0} key performance indicators</li>
                      <li>✅ Designed comprehensive business dashboard</li>
                      <li>✅ Created automated reporting schedule</li>
                      <li>✅ Set up measurement framework for growth tracking</li>
                      <li>✅ Established data-driven decision making system</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <p className="text-sm text-blue-800">
                      Move on to Step 8: Conversion Optimization to maximize your business performance and revenue.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Measurement Overview */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Measurement System Overview</h3>
            
            {/* KPI Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Key Performance Indicators</h4>
              {!kpiPlan || !kpiPlan.kpis || kpiPlan.kpis.length === 0 ? (
                <p className="text-gray-500 text-sm">No KPIs defined yet</p>
              ) : (
                <div className="space-y-2">
                  {kpiPlan.kpis.slice(0, 3).map((kpi, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <Target className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900 text-sm">{kpi.name}</span>
                      </div>
                      <p className="text-xs text-blue-700">Target: {kpi.target} | {kpi.frequency}</p>
                    </div>
                  ))}
                  {kpiPlan.kpis.length > 3 && (
                    <p className="text-xs text-gray-500">+ {kpiPlan.kpis.length - 3} more KPIs</p>
                  )}
                </div>
              )}
            </div>

            {/* Dashboard Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Dashboard Layout</h4>
              {!dashboardLayout ? (
                <p className="text-gray-500 text-sm">No dashboard layout created yet</p>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Layout className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">{dashboardLayout.layout}</span>
                  </div>
                  <p className="text-sm text-green-700">{dashboardLayout.sections?.length || 0} sections</p>
                  <p className="text-sm text-green-700">{dashboardLayout.tools?.length || 0} integrated tools</p>
                </div>
              )}
            </div>

            {/* Reporting Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Reporting Schedule</h4>
              {!reportingSchedule ? (
                <p className="text-gray-500 text-sm">No reporting schedule created yet</p>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="font-medium text-orange-900">{reportingSchedule.schedule}</span>
                  </div>
                  <p className="text-sm text-orange-700">{reportingSchedule.reports?.length || 0} automated reports</p>
                  <p className="text-sm text-orange-700">Daily, weekly, monthly, quarterly</p>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Setup Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">KPI Planning</span>
                  <span className={`text-sm font-medium ${hasKpiPlan ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasKpiPlan ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dashboard Layout</span>
                  <span className={`text-sm font-medium ${hasDashboardLayout ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasDashboardLayout ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reporting Schedule</span>
                  <span className={`text-sm font-medium ${hasReportingSchedule ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasReportingSchedule ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI KPI Modal */}
        {aiKpiModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI KPI Recommendations</h3>
                  <button
                    onClick={() => setAiKpiModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-recommended KPIs for authority-based service businesses</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating KPI recommendations...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">Recommended KPIs ({aiKpiSuggestions.length})</h4>
                      <button
                        onClick={useAIKpiSuggestions}
                        className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                      >
                        Use All KPIs
                      </button>
                    </div>
                    
                    {aiKpiSuggestions.map((kpi, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{kpi.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{kpi.description}</p>
                            <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{kpi.category}</span>
                              <span>Target: {kpi.target}</span>
                              <span>Track: {kpi.frequency}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 italic">{kpi.reasoning}</p>
                          </div>
                          <button
                            onClick={() => addIndividualKpi(kpi)}
                            className="ml-4 px-3 py-1 bg-[#0e9246] text-white text-sm rounded hover:bg-green-700"
                          >
                            Add KPI
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

        {/* AI Dashboard Modal */}
        {aiDashboardModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Dashboard Layout Design</h3>
                  <button
                    onClick={() => setAiDashboardModalOpen(false)}
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
                    <span className="ml-3 text-gray-600">Generating dashboard layout...</span>
                  </div>
                ) : aiDashboardSuggestion && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{aiDashboardSuggestion.layout}</h4>
                      <p className="text-gray-600 mb-4">{aiDashboardSuggestion.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Dashboard Sections ({aiDashboardSuggestion.sections.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiDashboardSuggestion.sections.map((section, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">{section.title}</h5>
                            <p className="text-xs text-gray-500 mb-2">{section.position}</p>
                            <p className="text-sm text-gray-600 mb-2">{section.purpose}</p>
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Widgets:</span> {section.widgets.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recommended Tools ({aiDashboardSuggestion.tools.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiDashboardSuggestion.tools.map((tool, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                            • {tool}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-2">Update Frequency</h5>
                      <p className="text-sm text-blue-800">{aiDashboardSuggestion.updateFrequency}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const content = JSON.stringify(aiDashboardSuggestion, null, 2);
                      navigator.clipboard.writeText(content);
                      alert('Dashboard layout copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={useAIDashboardSuggestion}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Use This Layout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Reporting Modal */}
        {aiReportingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Automated Reporting Schedule</h3>
                  <button
                    onClick={() => setAiReportingModalOpen(false)}
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
                    <span className="ml-3 text-gray-600">Generating reporting schedule...</span>
                  </div>
                ) : aiReportingSuggestion && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{aiReportingSuggestion.schedule}</h4>
                      <p className="text-gray-600 mb-4">{aiReportingSuggestion.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Automated Reports ({aiReportingSuggestion.reports.length})</h4>
                      <div className="space-y-4">
                        {aiReportingSuggestion.reports.map((report, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">{report.name}</h5>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{report.frequency}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{report.purpose}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                              <div>
                                <span className="font-medium">Schedule:</span> {report.time}
                              </div>
                              <div>
                                <span className="font-medium">Audience:</span> {report.audience}
                              </div>
                              <div>
                                <span className="font-medium">Format:</span> {report.format}
                              </div>
                              <div>
                                <span className="font-medium">Metrics:</span> {report.metrics.join(', ')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Automation Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiReportingSuggestion.automation.map((feature, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                            • {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Required Tools</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiReportingSuggestion.tools.map((tool, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                            • {tool}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const content = JSON.stringify(aiReportingSuggestion, null, 2);
                      navigator.clipboard.writeText(content);
                      alert('Reporting schedule copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={useAIReportingSuggestion}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Use This Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add KPI Modal */}
        {addKpiModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add Custom KPI</h3>
                  <button
                    onClick={() => setAddKpiModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KPI Name *</label>
                  <input
                    type="text"
                    value={kpiForm.name}
                    onChange={(e) => setKpiForm({...kpiForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Monthly Recurring Revenue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={kpiForm.description}
                    onChange={(e) => setKpiForm({...kpiForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="What does this KPI measure?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <input
                    type="text"
                    value={kpiForm.target}
                    onChange={(e) => setKpiForm({...kpiForm, target: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., $10,000/month, 15%, 50 leads"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Frequency</label>
                  <select
                    value={kpiForm.frequency}
                    onChange={(e) => setKpiForm({...kpiForm, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select frequency</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={kpiForm.category}
                    onChange={(e) => setKpiForm({...kpiForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select category</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Authority">Authority</option>
                    <option value="Service">Service</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddKpiModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!kpiForm.name) {
                      alert('Please enter KPI name');
                      return;
                    }
                    addIndividualKpi({...kpiForm, id: Date.now()});
                    setKpiForm({ name: '', description: '', target: '', frequency: '', category: '' });
                    setAddKpiModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Add KPI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step7;

