import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const Step1Report = () => {
  // Get saved personas from localStorage using the correct key
  const savedPersonas = JSON.parse(localStorage.getItem('step1_added_personas') || '[]');
  const savedClient = JSON.parse(localStorage.getItem('step1_ideal_client') || '{}');
  const hasPersonas = savedPersonas.length > 0;
  const hasClientData = Object.keys(savedClient).some(key => savedClient[key] && savedClient[key].trim().length > 0);

  // Calculate statistics
  const aiPersonas = savedPersonas.filter(p => p.source === 'ai');
  const manualPersonas = savedPersonas.filter(p => p.source === 'manual');
  const totalUnmetNeeds = aiPersonas.reduce((acc, persona) => {
    if (persona.unmetNeeds) {
      return acc + persona.unmetNeeds.split(',').length;
    }
    return acc;
  }, 0);

  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0e9246] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">👥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Step 1: Ideal Client Research Report</h1>
                <p className="text-gray-600">Authority Revenue Toolkit - CSP Implementation Guide</p>
              </div>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Dashboard</Link>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              This comprehensive report contains detailed ideal client persona research, behavioral insights, and implementation guidelines for CSP (Customer Success Platform) setup. 
              Use this document to build persona-based targeting, segmentation, automated workflows, and personalized marketing campaigns in your HighLevel platform.
            </p>
          </div>
        </div>

        {hasPersonas || hasClientData ? (
          <>
            {/* Executive Summary */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">📊 Executive Summary</h2>
              
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="bg-[#0e9246] bg-opacity-10 rounded-lg p-6 border border-[#0e9246] border-opacity-20">
                  <h3 className="font-semibold text-[#0e9246] mb-2">Total Personas</h3>
                  <p className="text-3xl font-bold text-[#0e9246]">{savedPersonas.length}</p>
                  <p className="text-sm text-gray-600">Detailed client profiles</p>
                </div>
                
                <div className="bg-[#fbae42] bg-opacity-10 rounded-lg p-6 border border-[#fbae42] border-opacity-20">
                  <h3 className="font-semibold text-[#fbae42] mb-2">AI Research-Based</h3>
                  <p className="text-3xl font-bold text-[#fbae42]">{aiPersonas.length}</p>
                  <p className="text-sm text-gray-600">Data-driven personas</p>
                </div>
                
                <div className="bg-[#467a8f] bg-opacity-10 rounded-lg p-6 border border-[#467a8f] border-opacity-20">
                  <h3 className="font-semibold text-[#467a8f] mb-2">Manual Entries</h3>
                  <p className="text-3xl font-bold text-[#467a8f]">{manualPersonas.length}</p>
                  <p className="text-sm text-gray-600">Custom personas</p>
                </div>
                
                <div className="bg-[#d7df21] bg-opacity-10 rounded-lg p-6 border border-[#d7df21] border-opacity-20">
                  <h3 className="font-semibold text-gray-800 mb-2">Opportunity Areas</h3>
                  <p className="text-3xl font-bold text-gray-800">{totalUnmetNeeds}</p>
                  <p className="text-sm text-gray-600">Unmet needs identified</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">🎯 Key Insights for CSP Implementation</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Platform Targeting:</h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• LinkedIn-focused personas: {aiPersonas.filter(p => p.platformPreferences?.includes('LinkedIn')).length}</li>
                      <li>• Social media active: {aiPersonas.filter(p => p.platformPreferences?.includes('Twitter') || p.platformPreferences?.includes('X/')).length}</li>
                      <li>• Industry forum users: {aiPersonas.filter(p => p.platformPreferences?.includes('forum')).length}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Automation Opportunities:</h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Lead qualification workflows</li>
                      <li>• Platform-specific content delivery</li>
                      <li>• Behavioral trigger campaigns</li>
                      <li>• Persona-based nurture sequences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* CSP Implementation Guide */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">🚀 CSP Implementation Guide</h2>
              
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">🎭 Detailed Persona Profiles</h2>
              
              {savedPersonas.map((persona, index) => (
                <div key={persona.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{persona.title}</h3>
                      <p className="text-gray-600 font-medium">{persona.description}</p>
                      {persona.summary && (
                        <p className="text-sm text-gray-500 italic mt-2">{persona.summary}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        persona.source === 'ai' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {persona.source === 'ai' ? '🤖 AI Research-Based' : '✏️ Manual Entry'}
                      </span>
                      <span className="text-xs text-gray-500">Persona #{index + 1}</span>
                    </div>
                  </div>

                  {/* CSP Implementation Data */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">📊 CSP Implementation Data</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Tag Name:</span>
                        <p className="text-gray-600">{persona.title.replace(/\s+/g, '_')}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Lead Score Weight:</span>
                        <p className="text-gray-600">{persona.source === 'ai' ? 'High (25 pts)' : 'Medium (15 pts)'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Segment Priority:</span>
                        <p className="text-gray-600">{index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Persona Details */}
                  {persona.source === 'ai' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {persona.keyBehaviors && (
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">🎯 Key Behaviors</h4>
                            <p className="text-gray-600 text-sm bg-white p-3 rounded border">{persona.keyBehaviors}</p>
                          </div>
                        )}
                        
                        {persona.platformPreferences && (
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">📱 Platform Preferences</h4>
                            <p className="text-gray-600 text-sm bg-white p-3 rounded border">{persona.platformPreferences}</p>
                          </div>
                        )}
                        
                        {persona.motivations && (
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">💭 Motivations</h4>
                            <p className="text-gray-600 text-sm bg-white p-3 rounded border">{persona.motivations}</p>
                          </div>
                        )}
                        
                        {persona.frustrations && (
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">😤 Frustrations</h4>
                            <p className="text-gray-600 text-sm bg-white p-3 rounded border italic">{persona.frustrations}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {persona.favoriteBrands && (
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">🛍️ Favorite Brands</h4>
                            <p className="text-gray-600 text-sm bg-white p-3 rounded border">{persona.favoriteBrands}</p>
                          </div>
                        )}
                        
                        {persona.buyingTriggers && (
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">⚡ Buying Triggers</h4>
                            <p className="text-gray-600 text-sm bg-white p-3 rounded border">{persona.buyingTriggers}</p>
                          </div>
                        )}
                        
                        {persona.contentResonance && (
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">📈 Content Resonance</h4>
                            <p className="text-gray-600 text-sm bg-white p-3 rounded border">{persona.contentResonance}</p>
                          </div>
                        )}
                        
                        {persona.unmetNeeds && (
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">🔍 Unmet Needs & Opportunities</h4>
                            <p className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200 font-medium">{persona.unmetNeeds}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Manual Persona Details */}
                  {persona.source === 'manual' && persona.details && (
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-800 text-sm mb-2">📝 Additional Details</h4>
                      <p className="text-gray-600 text-sm">{persona.details}</p>
                    </div>
                  )}

                  {/* CSP Action Items for this Persona */}
                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">🚀 CSP Action Items for {persona.title}</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Create contact tag: "{persona.title.replace(/\s+/g, '_')}"</li>
                      <li>• Build email sequence addressing their primary frustrations</li>
                      <li>• Set up lead magnet targeting their biggest problem</li>
                      {persona.platformPreferences && (
                        <li>• Configure ads for: {persona.platformPreferences.split(',')[0]?.trim()}</li>
                      )}
                      {persona.buyingTriggers && (
                        <li>• Create automation trigger: {persona.buyingTriggers.split(',')[0]?.trim()}</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Manual Client Data */}
            {hasClientData && (
              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">📋 Manual Client Profile Data</h2>
                
                {savedClient.demographics && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Demographics</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{savedClient.demographics}</p>
                    </div>
                  </div>
                )}

                {savedClient.psychographics && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Psychographics</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{savedClient.psychographics}</p>
                    </div>
                  </div>
                )}

                {savedClient.painPoints && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Pain Points</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{savedClient.painPoints}</p>
                    </div>
                  </div>
                )}

                {savedClient.goals && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Goals & Aspirations</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{savedClient.goals}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Steps Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">🚀 Next Steps</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 mb-4">Immediate Actions</h3>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>• Import personas into CSP as contact tags</li>
                    <li>• Set up custom fields for persona data</li>
                    <li>• Create lead magnets for each persona</li>
                    <li>• Build persona-specific email sequences</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-4">Advanced Implementation</h3>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• Configure behavioral automation triggers</li>
                    <li>• Set up platform-specific ad campaigns</li>
                    <li>• Create persona-based landing pages</li>
                    <li>• Implement lead scoring workflows</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">
              Complete Step 1: Ideal Client Refinement to generate your comprehensive report.
            </p>
            <Link 
              to="/step1" 
              className="inline-flex items-center px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-[#0c7a3a] transition-colors"
            >
              Go to Step 1
            </Link>
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

