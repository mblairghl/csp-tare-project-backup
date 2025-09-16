import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: 'John Smith',
    company: 'Cultivating Sales, LLC'
  });

  const [stepProgress, setStepProgress] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false,
    step8: false,
    step9: false
  });

  // Load data from localStorage safely
  useEffect(() => {
    try {
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        const parsed = JSON.parse(savedUserData);
        if (parsed && typeof parsed === 'object') {
          setUserData(prev => ({ ...prev, ...parsed }));
        }
      }

      const savedProgress = localStorage.getItem('stepProgress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (parsed && typeof parsed === 'object') {
          setStepProgress(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (error) {
      console.log('Error loading data from localStorage:', error);
      // Continue with default values
    }
  }, []);

  // Clear all data function
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        // Clear localStorage
        localStorage.clear();
        
        // Reset state
        setStepProgress({
          step1: false,
          step2: false,
          step3: false,
          step4: false,
          step5: false,
          step6: false,
          step7: false,
          step8: false,
          step9: false
        });
        
        setUserData({
          name: 'John Smith',
          company: 'Cultivating Sales, LLC'
        });
        
        alert('All data has been cleared successfully!');
        
        // Refresh the page to ensure clean state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.log('Error clearing data:', error);
        alert('Data cleared (with some errors)');
      }
    }
  };

  // Define steps array safely
  const steps = [
    { id: 1, title: 'Ideal Client Refinement', color: 'bg-purple-500', completed: stepProgress?.step1 || false },
    { id: 2, title: 'Marketing Funnel Mapping', color: 'bg-orange-500', completed: stepProgress?.step2 || false },
    { id: 3, title: 'Lead Intelligence', color: 'bg-pink-500', completed: stepProgress?.step3 || false },
    { id: 4, title: 'Signature Funnel Build', color: 'bg-teal-500', completed: stepProgress?.step4 || false },
    { id: 5, title: 'Sales Pipeline Automation', color: 'bg-pink-500', completed: stepProgress?.step5 || false },
    { id: 6, title: 'Build Your Delivery System', color: 'bg-purple-500', completed: stepProgress?.step6 || false },
    { id: 7, title: 'Metrics & Monitoring', color: 'bg-red-500', completed: stepProgress?.step7 || false },
    { id: 8, title: 'Conversion Optimization', color: 'bg-green-500', completed: stepProgress?.step8 || false },
    { id: 9, title: 'Authority Amplification', color: 'bg-purple-500', completed: stepProgress?.step9 || false }
  ];

  // Define reports array safely
  const reports = [
    { id: 'project-setup', title: 'Project Setup Report', color: 'bg-blue-500', number: '11' },
    { id: 'comprehensive', title: 'Comprehensive Report', color: 'bg-red-500', number: '12' },
    { id: 'step1', title: 'Step 1: Ideal Client Report', color: 'bg-green-500', number: '13' },
    { id: 'step2', title: 'Step 2: Content Audit Report', color: 'bg-blue-500', number: '14' }
  ];

  // Calculate progress safely
  const completedSteps = stepProgress ? Object.values(stepProgress).filter(Boolean).length : 0;
  const progressPercentage = Math.round((completedSteps / 9) * 100);
  const remainingSteps = 9 - completedSteps;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-orange-500">Authority Revenue Toolkit</h1>
              <p className="text-gray-600 mt-1">{userData?.company || 'Cultivating Sales, LLC'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome Back</p>
              <p className="text-lg font-semibold text-gray-900">{userData?.name || 'John Smith'}</p>
            </div>
          </div>
        </div>

        {/* Clear Data Button */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
            <p className="text-gray-600 mb-4">Clear all stored data to start fresh or for testing purposes.</p>
            <button
              onClick={clearAllData}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Framework Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">FRAMEWORK STEPS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(steps) && steps.map((step) => (
              <a
                key={step.id}
                href={`/step/${step.id}`}
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold">{step.id}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Step {step.id}: {step.title}</h3>
                    {step.completed && (
                      <span className="text-sm text-green-600">✓ Completed</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Reports */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">REPORTS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(reports) && reports.map((report) => (
              <a
                key={report.id}
                href={`/report/${report.id}`}
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${report.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold">{report.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{report.title}</h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {completedSteps}
              </div>
              <div className="text-sm text-gray-600">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {progressPercentage}%
              </div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {remainingSteps}
              </div>
              <div className="text-sm text-gray-600">Steps Remaining</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Cultivating Sales, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

