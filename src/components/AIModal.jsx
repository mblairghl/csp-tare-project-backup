import React from 'react';

const AIModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  loading = false, 
  showCloseInstructions = true,
  onMoreIdeas,
  showMoreIdeas = false,
  selectedCount = 0,
  maxSets = 4,
  currentSet = 1
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    // For content suggestions, lead strategy, and funnel blueprint, allow closing without selection requirement
    if (title === "AI Content Suggestions" || title === "AI-Generated Lead Strategy" || title === "AI-Generated Funnel Blueprint") {
      onClose();
      return;
    }
    
    // For persona selection, require at least one selection
    if (selectedCount === 0) {
      alert('Please select at least one persona before closing.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {currentSet > 1 && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Set {currentSet} of {maxSets}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Instructions */}
        {showCloseInstructions && !loading && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Select multiple items by clicking "Add" buttons. Items will be added to your project. 
              {selectedCount === 0 && <span className="font-semibold"> You must select at least one persona before closing.</span>}
              {selectedCount > 0 && <span className="text-green-700 font-semibold"> {selectedCount} persona(s) selected!</span>}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-4 text-gray-600">Generating AI suggestions...</span>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="flex space-x-3">
              {showMoreIdeas && currentSet < maxSets && (
                <button
                  onClick={onMoreIdeas}
                  className="px-4 py-2 text-black rounded-lg font-medium transition-colors border-2 border-gray-300 hover:border-gray-400"
                  style={{ backgroundColor: '#d7df21' }}
                >
                  🤖 More Ideas
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {title === "AI-Generated Funnel Blueprint" 
                  ? `${selectedCount} component(s) selected`
                  : `${selectedCount} persona(s) selected`
                }
              </span>
              <button
                onClick={handleClose}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCount > 0 || title === "AI-Generated Funnel Blueprint"
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {title === "AI-Generated Funnel Blueprint" ? "Done" : "Done Selecting"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIModal;

