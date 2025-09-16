import React, { useContext, useState } from 'react';
import { FunnelContext } from '../context/FunnelContext';
import { Plus, X, FileText, Lightbulb } from 'lucide-react';

const ContentLibrary = () => {
  const {
    contentLibrary,
    setContentLibrary,
    funnelContent,
    addToFunnelStage,
    removeFromFunnelStage,
    removeFromContentLibrary,
    showAddContentModal,
    setShowAddContentModal,
    showGapModal,
    setShowGapModal
  } = useContext(FunnelContext);

  const [newContentForm, setNewContentForm] = useState({
    type: '',
    name: '',
    description: '',
    notes: ''
  });

  // Content types
  const contentTypes = [
    'Article', 'Blog Post', 'Video', 'Podcast', 'Webinar', 'E-book', 'Guide', 
    'Case Study', 'Template', 'Checklist', 'Infographic', 'Course', 'Workshop'
  ];

  // Funnel stages
  const funnelStages = [
    { 
      id: 'discover', 
      title: 'Discover the Possibility', 
      color: 'bg-blue-100 border-blue-300', 
      textColor: 'text-blue-800',
      description: 'They become aware that a better way exists.'
    },
    { 
      id: 'resonate', 
      title: 'Resonate with the Mission', 
      color: 'bg-green-100 border-green-300', 
      textColor: 'text-green-800',
      description: 'They connect emotionally with your message and positioning.'
    },
    { 
      id: 'envision', 
      title: 'Envision Their Transformation', 
      color: 'bg-yellow-100 border-yellow-300', 
      textColor: 'text-yellow-800',
      description: 'They see the tangible results of working with you.'
    },
    { 
      id: 'trust', 
      title: 'Trust the Process', 
      color: 'bg-orange-100 border-orange-300', 
      textColor: 'text-orange-800',
      description: 'They gain confidence in your ability to deliver.'
    },
    { 
      id: 'authority', 
      title: 'Step Into Authority', 
      color: 'bg-purple-100 border-purple-300', 
      textColor: 'text-purple-800',
      description: 'They are ready to take action and invest.'
    }
  ];

  // Add new content
  const handleAddContent = () => {
    if (newContentForm.name && newContentForm.type) {
      const newContent = {
        id: Date.now(),
        ...newContentForm
      };
      setContentLibrary(prev => [...prev, newContent]);
      setNewContentForm({ type: '', name: '', description: '', notes: '' });
      setShowAddContentModal(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column - Content Tools */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Content Asset</h4>
          <button
            onClick={() => setShowAddContentModal(true)}
            className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Content Asset</span>
          </button>
        </div>

        {/* Content Library Display */}
        {contentLibrary.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Library ({contentLibrary.length})</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contentLibrary.map((content) => (
                <div key={content.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 text-base">{content.name}</h5>
                      <p className="text-sm text-gray-600 font-medium">{content.type}</p>
                      {content.description && (
                        <p className="text-sm text-gray-700 mt-2">{content.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromContentLibrary(content.id)}
                      className="text-red-500 hover:text-red-700 ml-4 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gap Analysis Button */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Gap Analysis</h4>
          <button
            onClick={() => setShowGapModal(true)}
            className="w-full px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 flex items-center justify-center space-x-2"
          >
            <Lightbulb className="w-5 h-5" />
            <span>🧠 Get AI Ideas</span>
          </button>
        </div>
      </div>

      {/* Right Column - Funnel Content Goal */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Funnel Content Goal</h3>
        <p className="text-gray-600 mb-6">Goal: At least 2 content items per stage to start.</p>
        
        <div className="space-y-4">
          {funnelStages.map((stage) => (
            <div key={stage.id} className={`border-2 border-dashed rounded-lg p-4 ${stage.color}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className={`font-medium ${stage.textColor}`}>{stage.title}</h4>
                <span className={`text-sm ${stage.textColor}`}>
                  {funnelContent[stage.id].length} items
                </span>
              </div>
              <p className={`text-sm ${stage.textColor} mb-3`}>
                {stage.description}
              </p>
              
              {funnelContent[stage.id].length > 0 ? (
                <div className="space-y-2">
                  {funnelContent[stage.id].map((content) => (
                    <div key={content.id} className="bg-white bg-opacity-70 rounded p-3 flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-900">{content.name}</span>
                        <span className="text-xs text-gray-600 ml-2">{content.type}</span>
                      </div>
                      <button
                        onClick={() => removeFromFunnelStage(content.id, stage.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-6 ${stage.textColor} opacity-60`}>
                  No content assigned
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Content Modal */}
      {showAddContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Add New Content Asset</h3>
                <button
                  onClick={() => setShowAddContentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={newContentForm.type}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select type...</option>
                  {contentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Name</label>
                <input
                  type="text"
                  value={newContentForm.name}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter content name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newContentForm.description}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Brief description of the content..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowAddContentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContent}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;

