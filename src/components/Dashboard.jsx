import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Dashboard = () => {
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const tourSteps = [
    {
      title: "Welcome to Your Revenue Transformation Hub",
      content: "This dashboard is your command center for building a systematic, scalable business. Let's show you how each section works together to transform your expertise into consistent revenue.",
      target: null
    },
    {
      title: "Your Strategic Foundation",
      content: "This green section reminds you of your transformation goal: turning expertise into consistent revenue through systematic automation. This is your 'why' - the vision that drives everything else.",
      target: "hero"
    },
    {
      title: "Project Setup - Start Here First",
      content: "This is your foundation. Complete this to unlock personalized AI recommendations throughout every step. It defines your signature offer and ideal client - the core of your entire system.",
      target: "project-setup"
    },
    {
      title: "Your 9-Step Revenue System",
      content: "These steps transform scattered efforts into systematic revenue generation. PLAN (steps 1-3) clarifies your focus, ASSEMBLE (4-6) builds your system, MONITOR (7-9) optimizes performance.",
      target: "framework-progress"
    },
    {
      title: "Quick Navigation & Reports",
      content: "Use the sidebar to jump between steps and generate progress reports. Green shows completed sections, locked steps unlock as you advance. Reports track your transformation journey.",
      target: "sidebar"
    },
    {
      title: "Ready to Build Your Revenue System?",
      content: "Start with Project Setup to unlock everything. Each step builds systematically toward your goal: a business that generates revenue consistently, even when you're not actively working. Let's begin!",
      target: "project-setup"
    }
  ];

  const handleDashboardTour = () => {
    setShowTour(true);
    setTourStep(0);
  };

  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      
      // Auto-scroll to the targeted section
      setTimeout(() => {
        const targetId = tourSteps[nextStep].target;
        if (targetId) {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }
      }, 100);
    } else {
      closeTour();
    }
  };

  const closeTour = () => {
    setShowTour(false);
    setTourStep(0);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      // Preserve important settings before clearing
      const apiKey = localStorage.getItem('openai_api_key');
      const userSettings = localStorage.getItem('userSettings');
      
      // Clear localStorage
      localStorage.clear();
      
      // Restore preserved settings
      if (apiKey) {
        localStorage.setItem('openai_api_key', apiKey);
      }
      if (userSettings) {
        localStorage.setItem('userSettings', userSettings);
      }

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear any cookies (if applicable)
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });

      alert('All content data has been cleared successfully! Your API key and settings have been preserved. The page will now reload.');
      
      // Reload the page to reset state
      window.location.reload();
    }
  };

  const frameworkSteps = [
    {
      id: 1,
      title: 'Step 1: Ideal Client Refinement',
      description: 'Scattered → Focused',
      detail: 'Get crystal clear on who you serve best and stop wasting time on wrong-fit prospects who drain your energy and rarely become great clients.',
      status: 'PLAN',
      progress: '0% Complete',
      isUnlocked: true,
      path: '/step/1'
    },
    {
      id: 2,
      title: 'Step 2: Marketing Funnel Mapping',
      description: 'Wrapping → Systematic',
      detail: 'Transform your scattered content into an organized system that systematically guides prospects through your marketing journey instead of hoping they figure it out.',
      status: 'PLAN',
      progress: '0% Complete',
      isUnlocked: false,
      path: '/step/2'
    },
    {
      id: 3,
      title: 'Step 3: Lead Intelligence',
      description: 'Random → Strategic',
      detail: 'Discover which lead sources actually produce your best clients versus tire-kickers, so you can focus your time and money where it matters most.',
      status: 'PLAN',
      progress: '0% Complete',
      isUnlocked: false,
      path: '/step/3'
    },
    {
      id: 4,
      title: 'Step 4: Signature Funnel Build',
      description: 'Generic → Signature',
      detail: 'Here\'s where your Signature Solution gets a real-world presence. Take your plan & turn it into a functional frontend funnel that captures leads, educates, and converts.',
      status: 'ASSEMBLE',
      progress: '0% Complete',
      isUnlocked: false,
      path: '/step/4'
    },
    {
      id: 5,
      title: 'Step 5: Sales Pipeline Automation',
      description: 'Manual → Automated',
      detail: 'Create a proven discovery conversation framework that helps qualified prospects sell themselves while protecting your energy from wrong-fit clients.',
      status: 'ASSEMBLE',
      progress: '0% Complete',
      isUnlocked: false,
      path: '/step/5'
    },
    {
      id: 6,
      title: 'Step 6: Build Your Delivery System',
      description: 'Ad Hoc → Systematic',
      detail: 'You\'ve made the sale now it\'s time to deliver. You\'ll lay down the foundation for your course, membership, or client onboarding system inside CSP.',
      status: 'ASSEMBLE',
      progress: '0% Complete',
      isUnlocked: false,
      path: '/step/6'
    },
    {
      id: 7,
      title: 'Step 7: Metrics & Monitoring',
      description: 'Guessing → Data-Driven',
      detail: 'Turn guesswork into clarity with real-time dashboard that reveals what\'s working and what needs fixing.',
      status: 'MONITOR',
      progress: '0% Complete',
      isUnlocked: false,
      path: '/step/7'
    },
    {
      id: 8,
      title: 'Step 8: Conversion Optimization',
      description: 'Weak Points → Optimized',
      detail: 'Run low-friction tests that improve every part of your client\'s journey and boost ROI over time.',
      status: 'MONITOR',
      progress: '0% Complete',
      isUnlocked: false,
      path: '/step/8'
    },
    {
      id: 9,
      title: 'Step 9: Authority Amplification',
      description: 'Hidden Success → Market Recognition',
      detail: 'Transform your behind-the-scenes success into visible market leadership that compounds influence and demand.',
      status: 'MONITOR',
      progress: '0% Complete',
      isUnlocked: false,
      path: '/step/9'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLAN':
        return 'step-status plan';
      case 'ASSEMBLE':
        return 'step-status assemble';
      case 'MONITOR':
        return 'step-status monitor';
      default:
        return 'step-status';
    }
  };

  return (
    <main className="flex-1 p-4 lg:p-6" id="main-content">
      <div className="space-y-6 lg:space-y-8">
        {/* Hero Section */}
        <div id="hero" className="rounded-lg p-6 lg:p-8 text-white csp-3d-section text-center hero-section">
          <h1 className="text-2xl lg:text-4xl font-bold font-header mb-4">
            Transform Your Expertise Into Consistent Revenue
          </h1>
          <p className="text-base lg:text-lg mb-4">
            Congratulations! You've already done the hard part: mastering your expertise, showing up for your clients, and proving your value in the marketplace. Now you're ready for the next chapter.
          </p>
          <p className="text-sm lg:text-base mb-6">
            This is where we help you turn all that hard-earned knowledge into a system that scales—with structure, automation, and ease. Automation reduces the busywork, smooths out the chaos, and puts your business on autopilot—so you can finally stop the rat race of strategic leader instead of being stuck with hundreds of manual tasks every day. Let's get started!
          </p>
          
          {/* Strategic Advantage Section */}
          <div className="text-center mb-6">
            <h3 className="font-semibold mb-2 text-xl lg:text-2xl">Your Strategic Advantage</h3>
            <p className="text-base lg:text-lg">Focus on ONE signature solution first. Perfect that system, then replicate the process for additional offerings.</p>
          </div>
          
          {/* Two Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0" style={{backgroundColor: '#fbae42'}}>
                1
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Complete Your Project Setup</h4>
                <p className="text-sm opacity-90">Define your signature offer and lean structure for maximum efficiency</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0" style={{backgroundColor: '#fbae42'}}>
                2
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Work Through Each Framework Step</h4>
                <p className="text-sm opacity-90">Build your revenue engine systematically, step by step</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDashboardTour}
            className="btn-csp-orange inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all px-4 py-2"
          >
            Take The Dashboard Tour
          </button>
        </div>

        {/* Project Setup Section */}
        <div id="project-setup" className="bg-white rounded-xl border shadow-sm csp-3d-section project-setup-section">
          <div className="px-4 lg:px-6 py-6">
            <div className="mb-4">
              <h2 className="text-lg lg:text-xl font-semibold leading-none">Complete Your Project Setup (Required)</h2>
              <p className="text-gray-600 mt-2 text-sm lg:text-base">This information is required for personalized AI recommendations throughout the framework.</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm lg:text-base">
                <strong>Required:</strong> Complete your project setup to unlock all framework steps. The AI needs this information to provide personalized recommendations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6">
              <div>
                <h4 className="font-semibold mb-3">What you'll define:</h4>
                <ul className="space-y-2 text-gray-600 text-sm lg:text-base">
                  <li>• Your signature offer details</li>
                  <li>• Target client information</li>
                  <li>• Team structure and roles</li>
                  <li>• Revenue goals and timeline</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Why this matters:</h4>
                <ul className="space-y-2 text-gray-600 text-sm lg:text-base">
                  <li>• Personalized AI suggestions</li>
                  <li>• Customized content recommendations</li>
                  <li>• Customized framework sequence</li>
                  <li>• Better gap analysis results</li>
                </ul>
              </div>
            </div>
            
            <a 
              href="https://link.cultivatingsalespro.com/widget/survey/u2E2lY6KOgl7p44N0De2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-csp-green inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all px-4 py-2"
            >
              Start Required Project Setup
            </a>
          </div>
        </div>

        {/* CSP Software & Community Section */}
        <div id="reports" className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border shadow-sm csp-3d-section p-6">
            <h3 className="text-lg font-semibold mb-2">Log Into CSP Software</h3>
            <p className="text-gray-600 mb-4">Access your Cultivating Sales Pro Platform</p>
            <a 
              href="https://app.cultivatingsalespro.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              → app.cultivatingsalespro.com
            </a>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm csp-3d-section p-6">
            <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
            <p className="text-gray-600">Connect with other authority builders</p>
          </div>
        </div>
        {/* Framework Progress Section */}
        <div id="framework-progress" className="bg-white rounded-xl border shadow-sm csp-3d-section p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Framework Progress</h2>
            <p className="text-gray-600 mb-4">Complete all 9 steps to systematize your authority-based business</p>
            <div className="text-3xl font-bold text-gray-800">
              0/9 <span className="text-lg font-normal text-gray-600">Steps Complete</span>
            </div>
          </div>
          
          {/* Framework Steps Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {frameworkSteps.map((step) => (
              <div key={step.id} className="framework-step-card bg-gray-50 rounded-lg p-4 border csp-3d-section">
                <div className="mb-3">
                  <span className={getStatusColor(step.status)}>{step.status}</span>
                  <div className="text-sm text-gray-500 mt-1">{step.progress}</div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm font-medium text-blue-600 mb-2">{step.description}</p>
                <p className="text-sm text-gray-600 mb-4">{step.detail}</p>
                
                {step.isUnlocked ? (
                  <Link 
                    to={step.path}
                    className="btn-csp-green inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all px-4 py-2 w-full"
                  >
                    Continue
                  </Link>
                ) : (
                  <Link 
                    to={step.path}
                    className="bg-gray-300 text-gray-500 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 w-full hover:bg-gray-400 transition-colors"
                  >
                    🔒 Locked
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Developer Tools Section */}
        <div className="developer-tools rounded-lg p-6 csp-3d-section">
          <h3 className="text-lg font-semibold mb-2">Developer Tools & Troubleshooting</h3>
          <p className="text-sm text-gray-700 mb-4">
            <strong>Important:</strong> If the application stops responding (e.g., buttons don't open pop-ups), you may see the 'Device Exceeded' error in your browser console. This happens during testing when too much data is generated. Use the button below to reset your application data and resolve the issue.
          </p>
          <button 
            onClick={clearAllData}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Clear All My Data & Fix App
          </button>
        </div>

        <Footer />
      </div>

      {/* Dashboard Tour Popup */}
      {showTour && (
        <>
          {/* Overlay with spotlight effect */}
          <div className="fixed inset-0 bg-black bg-opacity-75 z-40">
            {tourSteps[tourStep].target && (
              <style jsx>{`
                #${tourSteps[tourStep].target} {
                  position: relative;
                  z-index: 45;
                  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.75);
                  border-radius: 8px;
                }
              `}</style>
            )}
          </div>
          
          {/* Tour popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg mx-4 shadow-2xl border-2 border-green-500">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-3 text-green-700">{tourSteps[tourStep].title}</h3>
                <p className="text-gray-700 leading-relaxed">{tourSteps[tourStep].content}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Step {tourStep + 1} of {tourSteps.length}
                  </span>
                  <div className="flex space-x-1">
                    {tourSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === tourStep ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-x-3">
                  <button 
                    onClick={closeTour}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Skip Tour
                  </button>
                  <button 
                    onClick={nextTourStep}
                    className="btn-csp-green px-6 py-2 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    {tourStep === tourSteps.length - 1 ? 'Start Building!' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;

