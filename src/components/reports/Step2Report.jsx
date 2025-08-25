import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const Step2Report = () => {
  const [marketingCopy, setMarketingCopy] = useState(null);
  const [contentAssets, setContentAssets] = useState([]);
  const [funnelStages, setFunnelStages] = useState({});

  useEffect(() => {
    // Load saved data
    const savedCopy = localStorage.getItem('marketingCopy');
    const savedAssets = localStorage.getItem('contentAssets');
    const savedStages = localStorage.getItem('funnelStages');
    
    if (savedCopy) {
      setMarketingCopy(JSON.parse(savedCopy));
    }
    if (savedAssets) {
      setContentAssets(JSON.parse(savedAssets));
    }
    if (savedStages) {
      setFunnelStages(JSON.parse(savedStages));
    }
  }, []);
  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Step 2: Content Audit Report</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">← Back to Dashboard</Link>
          </div>
          <p className="text-lg text-gray-600">Comprehensive analysis of your content audit and mapping work.</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 2 Completion Status</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Status:</strong> Step 2 has not been completed yet. Complete Step 2 to generate this report.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6 csp-3d-section no-hover">
              <h3 className="font-semibold mb-3">Content Library Overview</h3>
              <p className="text-gray-500 italic">Complete Step 2 to view your content library analysis here.</p>
            </div>

            <div className="border rounded-lg p-6 csp-3d-section no-hover">
              <h3 className="font-semibold mb-3">Funnel Stage Mapping</h3>
              <p className="text-gray-500 italic">Complete Step 2 to view your funnel stage mapping here.</p>
              <div className="grid grid-cols-5 gap-2 mt-4 opacity-50">
                <div className="text-center p-2 bg-blue-50 rounded text-sm">Awareness</div>
                <div className="text-center p-2 bg-green-50 rounded text-sm">Interest</div>
                <div className="text-center p-2 bg-yellow-50 rounded text-sm">Consideration</div>
                <div className="text-center p-2 bg-orange-50 rounded text-sm">Decision</div>
                <div className="text-center p-2 bg-purple-50 rounded text-sm">Retention</div>
              </div>
            </div>

            <div className="border rounded-lg p-6 csp-3d-section no-hover">
              <h3 className="font-semibold mb-3">Content Gap Analysis</h3>
              <p className="text-gray-500 italic">Complete Step 2 to view identified content gaps here.</p>
            </div>

            {/* Marketing Copy Section */}
            {marketingCopy ? (
              <div className="border rounded-lg p-6 csp-3d-section no-hover">
                <h3 className="font-semibold mb-6">Marketing Copy Strategy & TARE Framework</h3>
                
                {/* Core Brand Messaging */}
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">Core Brand Messaging</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-green-700 mb-2">Primary Value Proposition</h5>
                      <div className="bg-white border-l-4 border-green-400 p-4 rounded-r">
                        <p className="text-gray-800 italic">"{marketingCopy.primaryValueProposition}"</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-green-700 mb-2">Elevator Pitch (30 seconds)</h5>
                      <div className="bg-white border-l-4 border-green-400 p-4 rounded-r">
                        <p className="text-gray-800 italic">"{marketingCopy.elevatorPitch}"</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-green-700 mb-2">Mission Statement</h5>
                      <div className="bg-white border-l-4 border-green-400 p-4 rounded-r">
                        <p className="text-gray-800 italic">"{marketingCopy.missionStatement}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage-Optimized Marketing Copy */}
                {marketingCopy.stageOptimizedCopy && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">Stage-Optimized Marketing Copy</h4>
                    
                    {Object.entries(marketingCopy.stageOptimizedCopy).map(([stage, content]) => (
                      <div key={stage} className="mb-6">
                        <h5 className="font-semibold text-blue-700 mb-3 capitalize">
                          {stage.replace(/([A-Z])/g, ' $1').trim()}
                        </h5>
                        <div className="space-y-3">
                          {content.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded border-l-4 border-blue-300">
                              <div className="flex items-center justify-between mb-2">
                                <h6 className="font-medium text-gray-900">{item.title}</h6>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {item.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TARE Framework Implementation */}
                {marketingCopy.tareFramework && (
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-6">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4">TARE Framework Implementation</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(marketingCopy.tareFramework).map(([key, framework]) => (
                        <div key={key} className="bg-white p-4 rounded border-l-4 border-purple-300">
                          <h5 className="font-semibold text-purple-700 mb-2 capitalize">{key}</h5>
                          <p className="text-sm text-gray-600 mb-3">{framework.messaging}</p>
                          <ul className="text-xs text-gray-700 space-y-1">
                            {framework.elements.map((element, index) => (
                              <li key={index}>• {element}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-6 csp-3d-section no-hover">
                <h3 className="font-semibold mb-3">Marketing Copy Strategy & TARE Framework</h3>
                <p className="text-gray-500 italic">Complete Step 2 marketing copy generation to view your comprehensive copy strategy here.</p>
              </div>
            )}

            <div className="border rounded-lg p-6 csp-3d-section no-hover">
              <h3 className="font-semibold mb-3">Content Performance Metrics</h3>
              <p className="text-gray-500 italic">Performance metrics will appear here after completing Step 2.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link 
              to="/step/2"
              className="btn-csp-green inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all px-6 py-2"
            >
              Go to Step 2
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Step2Report;

