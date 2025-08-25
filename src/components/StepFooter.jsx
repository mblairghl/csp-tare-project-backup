import React from 'react';
import { Link } from 'react-router-dom';

const StepFooter = ({ currentStep, showNextStep = true }) => {
  const prevStep = currentStep - 1;
  const nextStep = currentStep + 1;
  
  const getPrevStepLink = () => {
    if (currentStep === 1) {
      return "/";
    }
    return `/step/${prevStep}`;
  };
  
  const getNextStepLink = () => {
    if (currentStep === 9) {
      return "/";
    }
    return `/step/${nextStep}`;
  };
  
  const getPrevStepText = () => {
    if (currentStep === 1) {
      return "← Back to Dashboard";
    }
    return "← Previous Step";
  };
  
  const getNextStepText = () => {
    if (currentStep === 9) {
      return "Return to Dashboard →";
    }
    return `Complete Step ${currentStep} →`;
  };

  return (
    <div className="mt-8 lg:mt-12 space-y-6 lg:space-y-8">
      {/* Navigation Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 lg:gap-0">
        <Link 
          to={getPrevStepLink()}
          className="text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center"
          style={{ backgroundColor: '#467a8f' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#3a6578'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#467a8f'}
        >
          <span className="text-sm lg:text-base">{getPrevStepText()}</span>
        </Link>
        
        {showNextStep && (
          <Link 
            to={getNextStepLink()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center"
          >
            <span className="text-sm lg:text-base">{getNextStepText()}</span>
          </Link>
        )}
      </div>
      
      {/* Copyright */}
      <div className="text-center py-4 lg:py-6 border-t border-gray-200">
        <p className="text-gray-500 text-sm lg:text-base">
          © 2025 Cultivating Sales, LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default StepFooter;

