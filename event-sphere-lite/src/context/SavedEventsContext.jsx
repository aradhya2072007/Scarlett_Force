import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedEventsContext = createContext();

export const useSavedEvents = () => {
  const context = useContext(SavedEventsContext);
  if (!context) {
    throw new Error('useSavedEvents must be used within a SavedEventsProvider');
  }
  return context;
};

export const SavedEventsProvider = ({ children }) => {
  const [savedEventIds, setSavedEventIds] = useState(() => {
    const saved = localStorage.getItem('savedEventIds');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedEventIds', JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  const toggleSave = (eventId) => {
    setSavedEventIds((prev) => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId) 
        : [...prev, eventId]
    );
  };

  const isSaved = (eventId) => savedEventIds.includes(eventId);

  const value = {
    savedEventIds,
    toggleSave,
    isSaved,
    count: savedEventIds.length
  };

  return (
    <SavedEventsContext.Provider value={value}>
      {children}
    </SavedEventsContext.Provider>
  );
};
