import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const Step2Report = () => {
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

