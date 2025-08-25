import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  House, 
  Users, 
  Funnel, 
  Lightbulb, 
  Zap, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  Target, 
  Crown,
  FileText,
  BarChart3,
  User,
  FileBarChart
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const frameworkSteps = [
    { path: '/step/1', icon: Users, label: 'Step 1: Ideal Client Refinement' },
    { path: '/step/2', icon: Funnel, label: 'Step 2: Marketing Funnel Mapping' },
    { path: '/step/3', icon: Lightbulb, label: 'Step 3: Lead Intelligence' },
    { path: '/step/4', icon: Zap, label: 'Step 4: Signature Funnel Build' },
    { path: '/step/5', icon: MessageSquare, label: 'Step 5: Sales Pipeline Automation' },
    { path: '/step/6', icon: BookOpen, label: 'Step 6: Build Your Delivery System' },
    { path: '/step/7', icon: TrendingUp, label: 'Step 7: Metrics & Monitoring' },
    { path: '/step/8', icon: Target, label: 'Step 8: Conversion Optimization' },
    { path: '/step/9', icon: Crown, label: 'Step 9: Authority Amplification' }
  ];

  const reports = [
    { path: '/reports/project-setup', icon: FileText, label: 'Project Setup Report' },
    { path: '/reports/comprehensive', icon: BarChart3, label: 'Comprehensive Report' },
    { path: '/reports/step1', icon: User, label: 'Step 1: Ideal Client Report' },
    { path: '/reports/step2', icon: FileBarChart, label: 'Step 2: Content Audit Report' }
  ];

  return (
    <div id="sidebar" className="sidebar-navigation w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        {/* Dashboard Link */}
        <Link 
          to="/" 
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-4 transition-colors ${
            isActive('/') 
              ? 'bg-green-100 text-green-800 border-l-4 border-green-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <House className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Framework Steps Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Framework Steps
          </h3>
          <div className="space-y-1">
            {frameworkSteps.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-green-100 text-green-800 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Reports Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Reports
          </h3>
          <div className="space-y-1">
            {reports.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-green-100 text-green-800 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

