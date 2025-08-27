import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, BarChart3, Layout, Calendar, Plus, Sparkles, X, Edit, Trash2, Target, TrendingUp, Activity } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step7 = () => {
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

  // Modal states
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [aiSuggestionsModalOpen, setAiSuggestionsModalOpen] = useState(false);
  const [currentModalType, setCurrentModalType] = useState('');

  // Performance tracking data
  const [kpiPlanning, setKpiPlanning] = useState({
    businessMetrics: '',
    performanceIndicators: '',
    trackingMethods: '',
    reportingFrequency: ''
  });

  const [dashboardLayout, setDashboardLayout] = useState({
    dashboardTools: '',
    visualizations: '',
    dataConnections: '',
    accessPermissions: ''
  });

  const [reportingSchedule, setReportingSchedule] = useState({
    reportTypes: '',
    automatedReports: '',
    stakeholderReports: '',
    actionableInsights: ''
  });

  // Added tracking items list
  const [addedTrackingItems, setAddedTrackingItems] = useState([]);

  // Manual form data
  const [manualForm, setManualForm] = useState({
    type: '',
    title: '',
    description: '',
    details: ''
  });

  // AI suggestions
  const [aiSuggestions, setAiSuggestions] = useState([]);
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
    const savedKpi = storageOptimizer.safeGet('step7_kpi_planning');
    const savedDashboard = storageOptimizer.safeGet('step7_dashboard_layout');
    const savedReporting = storageOptimizer.safeGet('step7_reporting_schedule');
    const savedItems = storageOptimizer.safeGet('step7_added_tracking_items');
    
    if (savedKpi && typeof savedKpi === 'object') {
      setKpiPlanning(savedKpi);
    }
    if (savedDashboard && typeof savedDashboard === 'object') {
      setDashboardLayout(savedDashboard);
    }
    if (savedReporting && typeof savedReporting === 'object') {
      setReportingSchedule(savedReporting);
    }
    if (savedItems && Array.isArray(savedItems)) {
      setAddedTrackingItems(savedItems);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const kpiComplete = Object.values(kpiPlanning).every(value => value && value.trim().length > 0);
    const dashboardComplete = Object.values(dashboardLayout).every(value => value && value.trim().length > 0);
    const reportingComplete = Object.values(reportingSchedule).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = kpiComplete && dashboardComplete && reportingComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [kpiPlanning, dashboardLayout, reportingSchedule, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleKpiChange = (field, value) => {
    const updated = { ...kpiPlanning, [field]: value };
    setKpiPlanning(updated);
    storageOptimizer.safeSet('step7_kpi_planning', updated);
  };

  const handleDashboardChange = (field, value) => {
    const updated = { ...dashboardLayout, [field]: value };
    setDashboardLayout(updated);
    storageOptimizer.safeSet('step7_dashboard_layout', updated);
  };

  const handleReportingChange = (field, value) => {
    const updated = { ...reportingSchedule, [field]: value };
    setReportingSchedule(updated);
    storageOptimizer.safeSet('step7_reporting_schedule', updated);
  };

  // Manual entry functions
  const openManualModal = (type) => {
    setCurrentModalType(type);
    setManualForm({
      type: type,
      title: '',
      description: '',
      details: ''
    });
    setManualModalOpen(true);
  };

  const handleManualSubmit = () => {
    if (manualForm.title && manualForm.description) {
      const newItem = {
        id: Date.now(),
        type: manualForm.type,
        title: manualForm.title,
        description: manualForm.description,
        details: manualForm.details,
        source: 'manual'
      };
      
      const updated = [...addedTrackingItems, newItem];
      setAddedTrackingItems(updated);
      storageOptimizer.safeSet('step7_added_tracking_items', updated);
      setManualModalOpen(false);
    }
  };

  // AI suggestions functions
  const openAiSuggestionsModal = async (type) => {
    setCurrentModalType(type);
    setAiSuggestionsModalOpen(true);
    
    // Generate AI suggestions based on type
    const suggestions = generateAiSuggestions(type);
    setAiSuggestions(suggestions);
  };

  const generateAiSuggestions = (type) => {
    const suggestionsByType = {
      'KPIs Planning': [
        { id: 1, title: 'Revenue Growth Metrics', description: 'Track monthly recurring revenue and growth rate', details: 'Monitor MRR, ARR, revenue growth percentage, and revenue per client' },
        { id: 2, title: 'Client Acquisition KPIs', description: 'Measure lead generation and conversion effectiveness', details: 'Track lead volume, conversion rates, cost per acquisition, and sales cycle length' },
        { id: 3, title: 'Client Satisfaction Metrics', description: 'Monitor client happiness and retention', details: 'Net Promoter Score, client retention rate, satisfaction surveys, testimonials' },
        { id: 4, title: 'Operational Efficiency KPIs', description: 'Track business process effectiveness', details: 'Project completion time, resource utilization, automation adoption rate' },
        { id: 5, title: 'Authority Building Metrics', description: 'Measure thought leadership and brand growth', details: 'Social media engagement, content reach, speaking opportunities, media mentions' }
      ],
      'Dashboard Layout': [
        { id: 1, title: 'Executive Dashboard', description: 'High-level overview for strategic decisions', details: 'Revenue trends, client metrics, growth indicators, and key alerts' },
        { id: 2, title: 'Sales Performance Dashboard', description: 'Track sales pipeline and conversion metrics', details: 'Pipeline value, conversion rates, sales activities, and forecasting' },
        { id: 3, title: 'Marketing Analytics Dashboard', description: 'Monitor marketing campaign effectiveness', details: 'Lead generation, content performance, social media metrics, ROI tracking' },
        { id: 4, title: 'Client Success Dashboard', description: 'Track client engagement and satisfaction', details: 'Client progress, engagement levels, support tickets, success milestones' },
        { id: 5, title: 'Financial Performance Dashboard', description: 'Monitor financial health and profitability', details: 'Revenue streams, expenses, profit margins, cash flow analysis' }
      ],
      'Reporting Schedule': [
        { id: 1, title: 'Weekly Performance Reports', description: 'Regular updates on key business metrics', details: 'Automated weekly summaries with trends, alerts, and action items' },
        { id: 2, title: 'Monthly Business Reviews', description: 'Comprehensive monthly business analysis', details: 'Detailed performance analysis, goal progress, and strategic recommendations' },
        { id: 3, title: 'Quarterly Strategic Reports', description: 'High-level strategic performance reviews', details: 'Quarterly goal assessment, market analysis, and strategic planning insights' },
        { id: 4, title: 'Client Progress Reports', description: 'Individual client success tracking', details: 'Client-specific progress reports, milestones achieved, and next steps' },
        { id: 5, title: 'ROI Analysis Reports', description: 'Return on investment tracking and analysis', details: 'Campaign ROI, investment performance, and optimization recommendations' }
      ]
    };
    
    return suggestionsByType[type] || [];
  };

  const addAiSuggestion = (suggestion) => {
    const newItem = {
      id: Date.now(),
      type: currentModalType,
      title: suggestion.title,
      description: suggestion.description,
      details: suggestion.details,
      source: 'ai'
    };
    
    const updated = [...addedTrackingItems, newItem];
    setAddedTrackingItems(updated);
    storageOptimizer.safeSet('step7_added_tracking_items', updated);
    
    // Remove suggestion from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  // Edit/Delete functions
  const editTrackingItem = (id) => {
    const item = addedTrackingItems.find(i => i.id === id);
    if (item) {
      setManualForm({
        type: item.type,
        title: item.title,
        description: item.description,
        details: item.details
      });
      setCurrentModalType(item.type);
      deleteTrackingItem(id); // Remove original
      setManualModalOpen(true);
    }
  };

  const deleteTrackingItem = (id) => {
    const updated = addedTrackingItems.filter(i => i.id !== id);
    setAddedTrackingItems(updated);
    storageOptimizer.safeSet('step7_added_tracking_items', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generatePerformanceTracking();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating performance tracking:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setKpiPlanning(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step7_kpi_planning', { ...kpiPlanning, ...content });
    } else if (activeSubStep === 2) {
      setDashboardLayout(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step7_dashboard_layout', { ...dashboardLayout, ...content });
    } else if (activeSubStep === 3) {
      setReportingSchedule(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step7_reporting_schedule', { ...reportingSchedule, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Build comprehensive performance tracking systems to monitor your business growth, optimize operations, and make data-driven decisions.",
    steps: [
      { title: 'KPIs Planning', description: 'Define and track key performance indicators for your business.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Dashboard Layout', description: 'Build visual dashboards for real-time performance monitoring.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Reporting Schedule', description: 'Create automated reporting for stakeholders and decision-making.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasKpiPlanning = Object.values(kpiPlanning).every(value => value && value.trim().length > 0);
  const hasDashboardLayout = Object.values(dashboardLayout).every(value => value && value.trim().length > 0);
  const hasReportingSchedule = Object.values(reportingSchedule).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasKpiPlanning; // Unlocked when KPI planning complete
      case 3: return hasKpiPlanning && hasDashboardLayout; // Unlocked when first two complete
      case 4: return hasKpiPlanning && hasDashboardLayout && hasReportingSchedule; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'KPIs Planning', icon: Target },
    { id: 2, title: 'Dashboard Layout', icon: Layout },
    { id: 3, title: 'Reporting Schedule', icon: Calendar },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">KPIs Planning</h3>
              <p className="text-gray-600 mb-6">
                Define and establish key performance indicators that will help you track business growth and make informed decisions.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Metrics
                  </label>
                  <textarea
                    value={kpiPlanning.businessMetrics}
                    onChange={(e) => handleKpiChange('businessMetrics', e.target.value)}
                    placeholder="Define your core business metrics: revenue, profit margins, client acquisition cost, lifetime value..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Indicators
                  </label>
                  <textarea
                    value={kpiPlanning.performanceIndicators}
                    onChange={(e) => handleKpiChange('performanceIndicators', e.target.value)}
                    placeholder="List specific KPIs you'll track: conversion rates, client satisfaction scores, project completion times..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Methods
                  </label>
                  <textarea
                    value={kpiPlanning.trackingMethods}
                    onChange={(e) => handleKpiChange('trackingMethods', e.target.value)}
                    placeholder="How will you track these KPIs? Tools, systems, data sources, collection methods..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Frequency
                  </label>
                  <textarea
                    value={kpiPlanning.reportingFrequency}
                    onChange={(e) => handleKpiChange('reportingFrequency', e.target.value)}
                    placeholder="How often will you review these KPIs? Daily, weekly, monthly reporting schedules..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('KPIs Planning')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('KPIs Planning')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added KPIs Planning Items */}
                {addedTrackingItems.filter(i => i.type === 'KPIs Planning').map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        {item.details && (
                          <p className="text-gray-500 text-sm mt-2">{item.details}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {item.source === 'ai' ? '🤖 AI Generated' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editTrackingItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTrackingItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasKpiPlanning && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">KPIs Planning Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to dashboard layout design.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Layout</h3>
              <p className="text-gray-600 mb-6">
                Design visual dashboards that provide real-time insights into your business performance and key metrics.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dashboard Tools
                  </label>
                  <textarea
                    value={dashboardLayout.dashboardTools}
                    onChange={(e) => handleDashboardChange('dashboardTools', e.target.value)}
                    placeholder="What tools will you use for dashboards? Google Data Studio, Tableau, Power BI, custom solutions..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visualizations
                  </label>
                  <textarea
                    value={dashboardLayout.visualizations}
                    onChange={(e) => handleDashboardChange('visualizations', e.target.value)}
                    placeholder="What types of charts and visualizations will you include? Graphs, tables, gauges, trend lines..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Connections
                  </label>
                  <textarea
                    value={dashboardLayout.dataConnections}
                    onChange={(e) => handleDashboardChange('dataConnections', e.target.value)}
                    placeholder="What data sources will connect to your dashboard? CRM, analytics, financial systems, marketing tools..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Permissions
                  </label>
                  <textarea
                    value={dashboardLayout.accessPermissions}
                    onChange={(e) => handleDashboardChange('accessPermissions', e.target.value)}
                    placeholder="Who will have access to which dashboards? Team roles, client access, stakeholder permissions..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Dashboard Layout')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Dashboard Layout')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Dashboard Layout Items */}
                {addedTrackingItems.filter(i => i.type === 'Dashboard Layout').map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        {item.details && (
                          <p className="text-gray-500 text-sm mt-2">{item.details}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {item.source === 'ai' ? '🤖 AI Generated' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editTrackingItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTrackingItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasDashboardLayout && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Dashboard Layout Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to reporting schedule setup.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reporting Schedule</h3>
              <p className="text-gray-600 mb-6">
                Create automated reporting schedules that provide regular insights and support data-driven decision making.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Types
                  </label>
                  <textarea
                    value={reportingSchedule.reportTypes}
                    onChange={(e) => handleReportingChange('reportTypes', e.target.value)}
                    placeholder="What types of reports will you create? Performance reports, financial summaries, client progress reports..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Automated Reports
                  </label>
                  <textarea
                    value={reportingSchedule.automatedReports}
                    onChange={(e) => handleReportingChange('automatedReports', e.target.value)}
                    placeholder="Which reports will be automated? Daily summaries, weekly performance, monthly reviews..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stakeholder Reports
                  </label>
                  <textarea
                    value={reportingSchedule.stakeholderReports}
                    onChange={(e) => handleReportingChange('stakeholderReports', e.target.value)}
                    placeholder="What reports will you share with stakeholders? Client reports, investor updates, team summaries..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actionable Insights
                  </label>
                  <textarea
                    value={reportingSchedule.actionableInsights}
                    onChange={(e) => handleReportingChange('actionableInsights', e.target.value)}
                    placeholder="How will reports drive action? Recommendations, alerts, optimization suggestions..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Reporting Schedule')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Reporting Schedule')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Reporting Schedule Items */}
                {addedTrackingItems.filter(i => i.type === 'Reporting Schedule').map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        {item.details && (
                          <p className="text-gray-500 text-sm mt-2">{item.details}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {item.source === 'ai' ? '🤖 AI Generated' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editTrackingItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTrackingItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasReportingSchedule && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Reporting Schedule Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your metrics and monitoring system is now complete. Check out the milestone reflection!
                  </p>
                </div>
              )}
            </div>

            {/* AI Enhancement Section */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#d7df21]" />
                <h3 className="text-xl font-semibold text-gray-900">AI Enhancement</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Get AI-powered suggestions to optimize your complete metrics and monitoring system.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Metrics Strategy
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {showConfetti && (
              <Confetti
                width={windowDimensions.width}
                height={windowDimensions.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.3}
              />
            )}
            
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0e9246] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🎉 Milestone Achieved!
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Congratulations! You've built a comprehensive metrics and monitoring system that will drive data-driven growth.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Established key performance indicators</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Designed visual performance dashboards</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created automated reporting schedules</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Enabled data-driven decision making</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <BarChart3 className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll have clear visibility into business performance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BarChart3 className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Decisions will be based on real data</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BarChart3 className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Problems will be identified early</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BarChart3 className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Growth opportunities will be maximized</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    What gets measured gets managed. Your metrics and monitoring system transforms your business from guesswork to precision, enabling you to optimize every aspect of your operations and accelerate growth with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 7 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Metrics & Monitoring
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Build comprehensive performance tracking systems to monitor your business growth, optimize operations, and make data-driven decisions.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 7 Complete! Your metrics and monitoring is set up.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have comprehensive systems to monitor and optimize your business.
              </p>
            </div>
          </div>
        )}

        {/* Component 4: How This Works Section */}
        <div className={`rounded-lg shadow-sm border border-gray-200 mb-6 ${isHowThisWorksOpen ? 'bg-white' : 'bg-white'}`}>
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#0e9246] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">How This Works</span>
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

        {/* Sub-step Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap">
            {subSteps.map((step, index) => {
              const isUnlocked = isSubStepUnlocked(step.id);
              const isActive = activeSubStep === step.id;
              const isCompleted = step.id < 4 ? (
                step.id === 1 ? hasKpiPlanning :
                step.id === 2 ? hasDashboardLayout :
                step.id === 3 ? hasReportingSchedule : false
              ) : isStepComplete;

              return (
                <button
                  key={step.id}
                  onClick={() => isUnlocked && setActiveSubStep(step.id)}
                  disabled={!isUnlocked}
                  className={`flex-1 min-w-0 px-4 py-4 text-center border-b-2 transition-colors duration-200 ${
                    isActive
                      ? 'border-[#fbae42] bg-orange-50'
                      : isUnlocked
                      ? 'border-transparent hover:border-gray-300 hover:bg-gray-50'
                      : 'border-transparent bg-gray-50'
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

        {/* Manual Entry Modal */}
        {manualModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold">Add {currentModalType}</h3>
                <button
                  onClick={() => setManualModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={manualForm.type}
                    onChange={(e) => setManualForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    <option value="KPIs Planning">KPIs Planning</option>
                    <option value="Dashboard Layout">Dashboard Layout</option>
                    <option value="Reporting Schedule">Reporting Schedule</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={manualForm.title}
                    onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Revenue Growth Metrics"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={manualForm.description}
                    onChange={(e) => setManualForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                  <textarea
                    value={manualForm.details}
                    onChange={(e) => setManualForm(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="Additional details (optional)..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={() => setManualModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualSubmit}
                  className="flex-1 px-4 py-2 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a]"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions Modal */}
        {aiSuggestionsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold">AI {currentModalType} Suggestions</h3>
                <button
                  onClick={() => setAiSuggestionsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Select from these AI-generated {currentModalType.toLowerCase()} suggestions:
                </p>
                
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                          <p className="text-gray-600 mt-1">{suggestion.description}</p>
                          <p className="text-gray-500 text-sm mt-2">{suggestion.details}</p>
                        </div>
                        <button
                          onClick={() => addAiSuggestion(suggestion)}
                          className="ml-4 px-4 py-2 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {aiSuggestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      All suggestions have been added! Close this modal to continue.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="AI Metrics & Monitoring"
          content={aiResult}
          isLoading={aiLoading}
          onUseContent={handleUseAIContent}
        />

        {/* API Key Modal */}
        <APIKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSave={handleSaveApiKey}
        />

        {/* Footer */}
        <StepFooter 
          currentStep={7}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step7;

