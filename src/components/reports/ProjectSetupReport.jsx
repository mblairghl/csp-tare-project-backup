import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const ProjectSetupReport = () => {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Project Setup Report</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">← Back to Dashboard</Link>
          </div>
          <p className="text-lg text-gray-600">Comprehensive overview of your project setup and configuration.</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Setup Status</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Status:</strong> Project setup is required to generate this report. Please complete your project setup first.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6 csp-3d-section no-hover">
              <h3 className="font-semibold mb-3">Signature Offer Details</h3>
              <p className="text-gray-500 italic">Complete project setup to view your signature offer details here.</p>
            </div>

            <div className="border rounded-lg p-6 csp-3d-section no-hover">
              <h3 className="font-semibold mb-3">Target Client Profile</h3>
              <p className="text-gray-500 italic">Complete project setup to view your target client information here.</p>
            </div>

            <div className="border rounded-lg p-6 csp-3d-section no-hover">
              <h3 className="font-semibold mb-3">Team Structure</h3>
              <p className="text-gray-500 italic">Complete project setup to view your team structure and roles here.</p>
            </div>

            <div className="border rounded-lg p-6 csp-3d-section no-hover">
              <h3 className="font-semibold mb-3">Revenue Goals</h3>
              <p className="text-gray-500 italic">Complete project setup to view your revenue goals and timeline here.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link 
              to="/"
              className="btn-csp-green inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all px-6 py-2"
            >
              Complete Project Setup
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default ProjectSetupReport;

