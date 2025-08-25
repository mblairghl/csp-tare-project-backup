import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const Step1Report = () => {
  // Get saved personas from localStorage
  const savedPersonas = JSON.parse(localStorage.getItem('savedPersonas') || '[]');
  const hasPersonas = savedPersonas.length > 0;

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
                <h1 className="text-3xl font-bold text-gray-900">Step 1: Ideal Client Report</h1>
                <p className="text-gray-600">Authority Revenue Toolkit - Cultivating Sales, LLC</p>
              </div>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Dashboard</Link>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              This comprehensive report contains all ideal client persona data and implementation guidelines for CSP (Customer Success Platform) setup. 
              Use this document to build out persona-based targeting, segmentation, and personalized marketing campaigns.
            </p>
          </div>
        </div>

        {hasPersonas ? (
          <>
            {/* Executive Summary */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Executive Summary</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 mb-2">Personas Created</h3>
                  <p className="text-3xl font-bold text-green-600">{savedPersonas.length}</p>
                  <p className="text-sm text-green-700">Detailed client personas defined</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Implementation Ready</h3>
                  <p className="text-3xl font-bold text-blue-600">✓</p>
                  <p className="text-sm text-blue-700">Ready for CSP deployment</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="font-semibold text-yellow-800 mb-2">Why This Step Is Critical</h3>
                <p className="text-yellow-700">
                  Ideal client personas form the foundation of all marketing and sales activities. Without clearly defined personas, 
                  marketing efforts become generic and fail to resonate with specific audience segments. These personas will drive 
                  content creation, funnel design, lead qualification, and conversion optimization throughout the entire framework.
                </p>
              </div>
            </div>

            {/* CSP Implementation Guide */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">CSP Implementation Guide</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-4">📋 Step-by-Step CSP Setup</h3>
                  <ol className="list-decimal list-inside space-y-3 text-blue-700">
                    <li><strong>Create Contact Tags:</strong> Set up tags for each persona name (e.g., "Sarah_Entrepreneur", "Visionary_Victor")</li>
                    <li><strong>Build Custom Fields:</strong> Create fields for Age Range, Income Level, Biggest Problem, Primary Goal</li>
                    <li><strong>Set Up Segmentation:</strong> Create smart lists based on persona characteristics</li>
                    <li><strong>Configure Lead Scoring:</strong> Assign points based on persona-specific behaviors</li>
                    <li><strong>Design Email Templates:</strong> Create persona-specific email sequences</li>
                    <li><strong>Set Up Automation:</strong> Build workflows that trigger based on persona identification</li>
                  </ol>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 mb-4">🎯 Targeting Configuration</h3>
                  <ul className="list-disc list-inside space-y-2 text-green-700">
                    <li>Use persona pain points for ad copy and landing page headlines</li>
                    <li>Configure lead magnets that address specific persona problems</li>
                    <li>Set up persona-based nurture sequences in CSP</li>
                    <li>Create custom audiences for each persona in advertising platforms</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Persona Data */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Detailed Persona Data</h2>
              
              {savedPersonas.map((persona, index) => (
                <div key={persona.id} className="mb-8 last:mb-0">
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Persona {index + 1}: {persona.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{persona.summary}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Demographics</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li><strong>Age Range:</strong> {persona.age_range}</li>
                          <li><strong>Occupation:</strong> {persona.occupation}</li>
                          <li><strong>Income Level:</strong> {persona.income_level}</li>
                          <li><strong>Location:</strong> {persona.location}</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Key Insights</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li><strong>Biggest Problem:</strong> {persona.biggest_problem}</li>
                          <li><strong>Primary Goal:</strong> {persona.primary_goal}</li>
                          <li><strong>Communication Style:</strong> {persona.communication_style}</li>
                          <li><strong>Current Solution:</strong> {persona.current_solution}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Copy-Paste Ready Content */}
                  <div className="border rounded-lg p-6 bg-white">
                    <h4 className="font-semibold text-gray-800 mb-4">📋 Copy-Paste Ready Content for CSP</h4>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Contact Tag:</h5>
                        <code className="bg-white px-2 py-1 rounded text-sm">{persona.name.replace(/\s+/g, '_')}</code>
                      </div>

                      <div className="bg-gray-50 rounded p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Pain Points (for email sequences):</h5>
                        <div className="bg-white p-3 rounded text-sm">
                          {persona.pain_points && persona.pain_points.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {persona.pain_points.map((pain, idx) => (
                                <li key={idx}>{pain}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>{persona.biggest_problem}</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Goals (for value propositions):</h5>
                        <div className="bg-white p-3 rounded text-sm">
                          {persona.goals && persona.goals.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {persona.goals.map((goal, idx) => (
                                <li key={idx}>{goal}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>{persona.primary_goal}</p>
                          )}
                        </div>
                      </div>

                      {persona.platforms_active && persona.platforms_active.length > 0 && (
                        <div className="bg-gray-50 rounded p-4">
                          <h5 className="font-medium text-gray-700 mb-2">Active Platforms (for targeting):</h5>
                          <div className="bg-white p-3 rounded text-sm">
                            {persona.platforms_active.join(', ')}
                          </div>
                        </div>
                      )}

                      {persona.additional_notes && (
                        <div className="bg-gray-50 rounded p-4">
                          <h5 className="font-medium text-gray-700 mb-2">Additional Notes:</h5>
                          <div className="bg-white p-3 rounded text-sm">
                            {persona.additional_notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Next Steps & Integration</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-4">🔄 How This Connects to Future Steps</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li><strong>Step 2 - Marketing Funnel Mapping:</strong> These personas will determine funnel stages and content</li>
                    <li><strong>Step 3 - Lead Intelligence:</strong> Persona data will drive lead scoring and qualification</li>
                    <li><strong>Step 4 - Signature Funnel Build:</strong> Funnels will be persona-specific and targeted</li>
                    <li><strong>Step 5 - Sales Pipeline:</strong> Sales processes will address persona-specific objections</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 mb-4">✅ Implementation Checklist</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-green-700">Create contact tags for each persona in CSP</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-green-700">Set up custom fields for persona data</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-green-700">Build smart lists for persona segmentation</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-green-700">Configure lead scoring based on persona fit</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-green-700">Create persona-specific email templates</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Step 1 Not Completed</h2>
              <p className="text-gray-600 mb-6">
                Complete Step 1 to generate your comprehensive ideal client report with persona data and CSP implementation guidelines.
              </p>
              <Link 
                to="/step/1"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Go to Step 1
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Cultivating Sales, LLC. All rights reserved. | Authority Revenue Toolkit | Page 1 of 1
          </p>
        </div>
      </div>
    </main>
  );
};

export default Step1Report;

