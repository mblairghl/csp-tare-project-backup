import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const EditDeleteActions = ({ 
  onEdit, 
  onDelete, 
  position = "top-right",
  size = "md",
  showOnHover = true 
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  const buttonSizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5"
  };

  const positionClasses = {
    "top-right": "absolute top-4 right-4",
    "top-left": "absolute top-4 left-4",
    "bottom-right": "absolute bottom-4 right-4",
    "bottom-left": "absolute bottom-4 left-4",
    "inline": "flex"
  };

  const visibilityClass = showOnHover ? "opacity-0 group-hover:opacity-100" : "opacity-100";

  return (
    <div className={`
      ${positionClasses[position]} 
      flex gap-2 
      ${visibilityClass} 
      transition-opacity duration-200
    `}>
      {onEdit && (
        <button
          onClick={onEdit}
          className={`
            ${buttonSizeClasses[size]}
            bg-blue-500 text-white rounded-full 
            hover:bg-blue-600 transition-colors duration-200 
            shadow-md hover:shadow-lg
            transform hover:scale-105
          `}
          title="Edit"
        >
          <Edit2 className={sizeClasses[size]} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`
            ${buttonSizeClasses[size]}
            bg-red-500 text-white rounded-full 
            hover:bg-red-600 transition-colors duration-200 
            shadow-md hover:shadow-lg
            transform hover:scale-105
          `}
          title="Delete"
        >
          <Trash2 className={sizeClasses[size]} />
        </button>
      )}
    </div>
  );
};

export default EditDeleteActions;

