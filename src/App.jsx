import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Step6 from './components/Step6';
import Step7 from './components/Step7';
import Step8 from './components/Step8';
import Step9 from './components/Step9';
import ProjectSetupReport from './components/reports/ProjectSetupReport';
import ComprehensiveReport from './components/reports/ComprehensiveReport';
import Step1Report from './components/reports/Step1Report';
import Step2Report from './components/reports/Step2Report';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Mobile Hamburger Menu */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {isSidebarOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
                
                <img src="/logo.png" alt="Cultivating Sales Logo" className="h-8 w-8" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Authority Revenue Toolkit</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Cultivating Sales, LLC</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 hidden sm:block">Welcome Back</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">John Smith</p>
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/step/1" element={<Step1 />} />
              <Route path="/step/2" element={<Step2 />} />
              <Route path="/step/3" element={<Step3 />} />
              <Route path="/step/4" element={<Step4 />} />
              <Route path="/step/5" element={<Step5 />} />
              <Route path="/step/6" element={<Step6 />} />
              <Route path="/step/7" element={<Step7 />} />
              <Route path="/step/8" element={<Step8 />} />
              <Route path="/step/9" element={<Step9 />} />
              <Route path="/reports/project-setup" element={<ProjectSetupReport />} />
              <Route path="/reports/comprehensive" element={<ComprehensiveReport />} />
              <Route path="/reports/step1" element={<Step1Report />} />
              <Route path="/reports/step2" element={<Step2Report />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

