import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const ComprehensiveReport = () => {
  // Get saved data from localStorage
  const savedPersonas = JSON.parse(localStorage.getItem('savedPersonas') || '[]');
  const projectSetup = JSON.parse(localStorage.getItem('projectSetup') || '{}');
  
  // Calculate progress
  const completedSteps = savedPersonas.length > 0 ? 1 : 0;
  const progressPercentage = Math.round((completedSteps / 9) * 100);
  
  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logo */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌱</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Comprehensive Authority Revenue Report</h1>
                <p className="text-gray-600">Authority Revenue Toolkit - Cultivating Sales, LLC</p>
              </div>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Dashboard</Link>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              This comprehensive report consolidates all framework progress, deliverables, and implementation guidelines for CSP deployment. 
              Use this master document to track progress and coordinate implementation across all framework phases.
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Executive Summary</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{completedSteps}/9</div>
              <div className="text-sm text-blue-700">Steps Completed</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{progressPercentage}%</div>
              <div className="text-sm text-green-700">Framework Complete</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">{savedPersonas.length}</div>
              <div className="text-sm text-orange-700">Client Personas Defined</div>
            </div>
          </div>

          {projectSetup.businessName && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Project Overview</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong>Business:</strong> {projectSetup.businessName}</div>
                <div><strong>Industry:</strong> {projectSetup.industry || 'Not specified'}</div>
                <div><strong>Target Market:</strong> {projectSetup.targetMarket || 'Not specified'}</div>
                <div><strong>Primary Goal:</strong> {projectSetup.primaryGoal || 'Not specified'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Framework Progress */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Framework Progress Summary</h2>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">PLAN Phase (Steps 1-3)</h3>
                <span className="text-sm text-gray-500">{completedSteps >= 1 ? Math.min(completedSteps, 3) : 0}/3 Complete</span>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded ${savedPersonas.length > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${savedPersonas.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      {savedPersonas.length > 0 ? '✓' : '1'}
                    </span>
                    <span>Step 1: Ideal Client Refinement</span>
                  </div>
                  <span className={`text-sm ${savedPersonas.length > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {savedPersonas.length > 0 ? 'Complete' : 'Pending'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">2</span>
                    <span>Step 2: Marketing Funnel Mapping</span>
                  </div>
                  <span className="text-sm text-gray-500">Pending</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">3</span>
                    <span>Step 3: Lead Intelligence</span>
                  </div>
                  <span className="text-sm text-gray-500">Pending</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">ASSEMBLE Phase (Steps 4-6)</h3>
                <span className="text-sm text-gray-500">0/3 Complete</span>
              </div>
              <p className="text-gray-500 text-sm">Complete PLAN phase to unlock ASSEMBLE phase steps.</p>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">MONITOR Phase (Steps 7-9)</h3>
                <span className="text-sm text-gray-500">0/3 Complete</span>
              </div>
              <p className="text-gray-500 text-sm">Complete PLAN and ASSEMBLE phases to unlock MONITOR phase steps.</p>
            </div>
          </div>
        </div>

        {/* Step 1 Results */}
        {savedPersonas.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Step 1: Ideal Client Personas</h2>
            
            <div className="mb-6">
              <div className="bg-green-50 border-l-4 border-green-400 p-6">
                <h3 className="font-semibold text-green-800 mb-2">✅ Completed Successfully</h3>
                <p className="text-green-700">
                  {savedPersonas.length} detailed client persona{savedPersonas.length > 1 ? 's' : ''} created and ready for CSP implementation.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4">📊 Persona Summary</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {savedPersonas.map((persona, index) => (
                    <div key={persona.id} className="bg-white rounded p-4 border">
                      <h4 className="font-medium text-gray-900 mb-2">{persona.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{persona.occupation} • {persona.age_range}</p>
                      <p className="text-xs text-gray-500"><strong>Key Problem:</strong> {persona.biggest_problem}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-4">🔄 Impact on Future Steps</h3>
                <ul className="space-y-2 text-yellow-700 text-sm">
                  <li><strong>Step 2:</strong> Personas will determine funnel stages and messaging strategy</li>
                  <li><strong>Step 3:</strong> Lead scoring will be based on persona fit and characteristics</li>
                  <li><strong>Step 4:</strong> Signature funnels will be persona-specific and targeted</li>
                  <li><strong>Step 5:</strong> Sales processes will address persona-specific objections</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">📋 CSP Implementation Status</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-700 text-sm">Contact tags created for each persona</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-700 text-sm">Custom fields configured for persona data</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-700 text-sm">Smart lists created for segmentation</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-700 text-sm">Lead scoring configured</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Link 
                to="/reports/step1"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                View Detailed Step 1 Report
              </Link>
            </div>
          </div>
        )}

        {/* Next Actions */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Next Recommended Actions</h2>
          
          <div className="space-y-4">
            {savedPersonas.length === 0 ? (
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-red-800">Priority:</span>
                  <span className="text-red-700 ml-2">Complete Step 1: Ideal Client Refinement</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-orange-800">Next:</span>
                  <span className="text-orange-700 ml-2">Begin Step 2: Marketing Funnel Mapping</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <span className="font-medium text-blue-800">Ongoing:</span>
                <span className="text-blue-700 ml-2">Implement Step 1 personas in CSP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Framework Performance Metrics</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Completion Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Framework Progress</span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Personas Defined</span>
                  <span className="font-medium">{savedPersonas.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Implementation Ready</span>
                  <span className="font-medium">{savedPersonas.length > 0 ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Quality Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Completeness</span>
                  <span className="font-medium">{savedPersonas.length > 0 ? 'High' : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CSP Ready</span>
                  <span className="font-medium">{savedPersonas.length > 0 ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Implementation Guide</span>
                  <span className="font-medium">{savedPersonas.length > 0 ? 'Available' : 'Pending'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Export & Implementation</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Available Reports</h3>
              <div className="space-y-2">
                {savedPersonas.length > 0 && (
                  <Link 
                    to="/reports/step1"
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Step 1: Ideal Client Report</div>
                    <div className="text-sm text-gray-600">Comprehensive persona data and CSP implementation guide</div>
                  </Link>
                )}
                
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="font-medium text-gray-500">Step 2: Marketing Funnel Report</div>
                  <div className="text-sm text-gray-400">Available after completing Step 2</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Implementation Support</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• CSP setup guides included in each step report</p>
                <p>• Copy-paste ready content for implementation</p>
                <p>• Cross-step integration guidelines</p>
                <p>• Quality checklists for validation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Cultivating Sales, LLC. All rights reserved. | Authority Revenue Toolkit | Comprehensive Report
          </p>
        </div>
      </div>
    </main>
  );
};

export default ComprehensiveReport;

