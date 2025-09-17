import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stepProgress, setStepProgress] = useState({});

  useEffect(() => {
    // Safe data loading with error handling
    try {
      const storedUserData = localStorage.getItem('userData');
      const storedStepProgress = localStorage.getItem('stepProgress');
      
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
      
      if (storedStepProgress) {
        const parsedStepProgress = JSON.parse(storedStepProgress);
        setStepProgress(parsedStepProgress);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Set default values if there's an error
      setUserData({ companyName: 'Your Company', name: 'User' });
      setStepProgress({});
    }
  }, []);

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        localStorage.clear();
        setUserData(null);
        setStepProgress({});
        window.location.reload();
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    }
  };

  // Framework steps data
  const frameworkSteps = [
    {
      id: 1,
      title: 'Ideal Client Refinement',
      description: 'Define your perfect customer persona',
      color: 'bg-blue-500',
      href: '/step/1'
    },
    {
      id: 2,
      title: 'Marketing Funnel Mapping',
      description: 'Map content to customer journey stages',
      color: 'bg-green-500',
      href: '/step/2'
    },
    {
      id: 3,
      title: 'Lead Intelligence',
      description: 'Set up lead tracking and scoring',
      color: 'bg-yellow-500',
      href: '/step/3'
    },
    {
      id: 4,
      title: 'Signature Funnel Build',
      description: 'Create your automated funnel',
      color: 'bg-purple-500',
      href: '/step/4'
    },
    {
      id: 5,
      title: 'Sales Pipeline Automation',
      description: 'Automate your sales process',
      color: 'bg-red-500',
      href: '/step/5'
    },
    {
      id: 6,
      title: 'Build Your Delivery System',
      description: 'Create client delivery workflows',
      color: 'bg-indigo-500',
      href: '/step/6'
    },
    {
      id: 7,
      title: 'Metrics & Monitoring',
      description: 'Track performance and ROI',
      color: 'bg-pink-500',
      href: '/step/7'
    },
    {
      id: 8,
      title: 'Conversion Optimization',
      description: 'Optimize for better results',
      color: 'bg-teal-500',
      href: '/step/8'
    },
    {
      id: 9,
      title: 'Authority Amplification',
      description: 'Scale your authority and reach',
      color: 'bg-orange-500',
      href: '/step/9'
    }
  ];

  // Reports data
  const reports = [
    {
      title: 'Project Setup Report',
      description: 'Initial project configuration and goals',
      href: '/reports/project-setup'
    },
    {
      title: 'Comprehensive Report',
      description: 'Complete analysis across all steps',
      href: '/reports/comprehensive'
    },
    {
      title: 'Step 1: Ideal Client Report',
      description: 'Detailed persona and market analysis',
      href: '/reports/step1'
    },
    {
      title: 'Step 2: Content Audit Report',
      description: 'Content mapping and gap analysis',
      href: '/reports/step2'
    }
  ];

  // Calculate progress
  const completedSteps = Object.values(stepProgress || {}).filter(Boolean).length;
  const totalSteps = frameworkSteps.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-500">Authority Revenue Toolkit</h1>
              <p className="text-gray-600 mt-1">Cultivating Sales, LLC</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back</p>
              <p className="font-medium text-gray-900">
                {userData?.name || 'John Smith'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completedSteps}</div>
              <div className="text-sm text-gray-500">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
              <div className="text-sm text-gray-500">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{totalSteps - completedSteps}</div>
              <div className="text-sm text-gray-500">Steps Remaining</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Framework Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Framework Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Framework Steps</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworkSteps.map((step) => {
              const isCompleted = stepProgress[`step${step.id}`] || false;
              
              return (
                <a
                  key={step.id}
                  href={step.href}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200 block"
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                      {step.id}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      {isCompleted && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Reports Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Reports</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report, index) => (
              <a
                key={index}
                href={report.href}
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200 block"
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    📊
                  </div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{report.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Clear Data Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Clear All Data</h3>
              <p className="text-sm text-gray-600">Reset all progress and start fresh</p>
            </div>
            <button
              onClick={handleClearAllData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 mt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © 2025 Cultivating Sales, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

