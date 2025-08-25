import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const ContentBox = ({ 
  children, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = "",
  title = null 
}) => {
  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 p-6 
      shadow-lg hover:shadow-xl 
      transform hover:-translate-y-1 
      transition-all duration-300 ease-in-out
      relative group
      ${className}
    `}>
      {/* Edit/Delete Actions */}
      {showActions && (onEdit || onDelete) && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-md"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-md"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Optional Title */}
      {title && (
        <div className="mb-4 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      {/* Content */}
      <div className={showActions && (onEdit || onDelete) ? "pr-20" : ""}>
        {children}
      </div>
    </div>
  );
};

export default ContentBox;

