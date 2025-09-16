import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const StepNavigation = ({ activeStep, setActiveStep, steps }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Steps</h2>
      <p className="text-gray-600 mb-6">Complete all Action Steps below before moving to the next Step page.</p>
      
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                activeStep === step.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-25'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeStep === step.id
                    ? 'bg-green-500 text-white'
                    : step.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="font-bold text-sm">{step.number}</span>
                  )}
                </div>
              </div>
              <div className={`text-sm font-medium ${
                activeStep === step.id ? 'text-green-700' : 'text-gray-700'
              }`}>
                {step.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;

