import React, { useState, useEffect } from 'react';

const ProgressList = ({ updates, onEdit, onDelete }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDeleteClick = (update) => {
    setDeleteConfirmation(update);
  };

  const handleConfirmDelete = () => {
    onDelete(deleteConfirmation.id);
    setDeleteConfirmation(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Progress Updates</h2>
      
      {updates.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No progress updates yet. Create your first update!</p>
      ) : (
        <div className="space-y-4">
          {updates.map(update => (
            <div key={update.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold dark:text-white">{update.title}</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => onEdit(update)}
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(update)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skill:</span>
                <span className="dark:text-white">{update.skill}</span>
              </div>
              
              <div className="flex gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress:</span>
                <span className="dark:text-white">{update.progress}</span>
              </div>
              
              {update.challenges && (
                <div className="flex gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Challenges:</span>
                  <span className="dark:text-white">{update.challenges}</span>
                </div>
              )}
              
              {update.nextSteps && (
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Steps:</span>
                  <span className="dark:text-white">{update.nextSteps}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the progress update "{deleteConfirmation.title}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressList; 