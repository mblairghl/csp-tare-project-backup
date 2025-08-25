import React from 'react';

const ChoiceCard = ({ 
  item, 
  onAdd, 
  onRemove, 
  showAddButton = true, 
  showRemoveButton = false, 
  isSelected = false,
  title,
  description,
  details
}) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-6 border transition-colors ${
      isSelected ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title || item.title || item.name}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          {showAddButton && !isSelected && (
            <button
              onClick={() => onAdd(item)}
              className="px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: '#fbae42' }}
            >
              Add
            </button>
          )}
          {showRemoveButton && (
            <button
              onClick={() => onRemove(item)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium transition-colors hover:bg-red-600"
            >
              Remove
            </button>
          )}
          {isSelected && (
            <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium">
              Added ✓
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {details && details.map((detail, index) => (
          <div key={index}>
            <h4 className="font-medium text-gray-900 mb-1">{detail.label}</h4>
            {Array.isArray(detail.value) ? (
              <ul className="text-sm text-gray-600 space-y-1">
                {detail.value.map((listItem, listIndex) => (
                  <li key={listIndex} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{listItem}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">{detail.value}</p>
            )}
          </div>
        ))}
        
        {/* Fallback for simple content */}
        {!details && item.content && (
          <p className="text-sm text-gray-600">{item.content}</p>
        )}
      </div>
    </div>
  );
};

export default ChoiceCard;

