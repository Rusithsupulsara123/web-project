import React, { useState, useEffect } from 'react';
import ProgressList from './ProgressList';
import ProgressForm from './ProgressForm';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const Progress = () => {
  // Load data from localStorage on component mount
  const [progressUpdates, setProgressUpdates] = useState(() => {
    const savedUpdates = localStorage.getItem('progressUpdates');
    return savedUpdates ? JSON.parse(savedUpdates) : [];
  });
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Save to localStorage whenever progressUpdates changes
  useEffect(() => {
    localStorage.setItem('progressUpdates', JSON.stringify(progressUpdates));
  }, [progressUpdates]);

  const showMessage = (message, type = 'success') => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleCreate = (newUpdate) => {
    const updateWithId = { ...newUpdate, id: Date.now() };
    setProgressUpdates([...progressUpdates, updateWithId]);
    setShowForm(false);
    setEditingUpdate(null);
    showMessage('Progress update created successfully!');
  };

  const handleUpdate = (updatedUpdate) => {
    // Check if any data has actually changed
    const originalUpdate = progressUpdates.find(update => update.id === updatedUpdate.id);
    const hasChanges = Object.keys(updatedUpdate).some(key => 
      originalUpdate[key] !== updatedUpdate[key]
    );

    if (!hasChanges) {
      showMessage('No changes were made to the progress update.', 'info');
      return;
    }

    setProgressUpdates(progressUpdates.map(update => 
      update.id === updatedUpdate.id ? updatedUpdate : update
    ));
    setEditingUpdate(null);
    setShowForm(false);
    showMessage('Progress update updated successfully!');
  };

  const handleDelete = (id) => {
    setProgressUpdates(progressUpdates.filter(update => update.id !== id));
    showMessage('Progress update deleted successfully!');
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUpdate(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Learning Progress Updates</h1>
      
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`${
            notificationType === 'success' ? 'bg-green-500' : 'bg-blue-500'
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in`}>
            {notificationType === 'success' ? <CheckCircleIcon /> : <InfoIcon />}
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}
      
      {!showForm ? (
        <div>
          <ProgressList 
            updates={progressUpdates}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setEditingUpdate(null);
                setShowForm(true);
              }}
              className="flex items-center space-x-1 bg-gradient-to-b from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg mx-auto text-sm shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all duration-200 active:shadow-none active:translate-y-2"
            >
              <span>Create New Update</span>
              <ArrowForwardIcon style={{ fontSize: '1rem' }} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <ProgressForm 
            onSubmit={editingUpdate ? handleUpdate : handleCreate}
            initialData={editingUpdate}
            isEditing={!!editingUpdate}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default Progress; 