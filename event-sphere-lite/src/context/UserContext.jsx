import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [joinedEvents, setJoinedEvents] = useState(() => {
    const saved = localStorage.getItem('joinedEvents');
    return saved ? JSON.parse(saved) : [];
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('eventSphereConversations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('joinedEvents', JSON.stringify(joinedEvents));
  }, [joinedEvents]);

  useEffect(() => {
    localStorage.setItem('eventSphereConversations', JSON.stringify(conversations));
  }, [conversations]);

  const joinEvent = (eventId) => {
    setJoinedEvents((prev) => 
      prev.includes(eventId) ? prev : [...prev, eventId]
    );
  };

  const isJoined = (eventId) => joinedEvents.includes(eventId);

  const sendMessage = (hostId, hostName, hostAvatar, messageText, isFromUser = true) => {
    setConversations((prev) => {
      const existingConvIndex = prev.findIndex((c) => c.hostId === hostId);
      const newMessage = {
        id: Date.now(),
        text: messageText,
        timestamp: new Date().toISOString(),
        isFromUser
      };

      if (existingConvIndex >= 0) {
        const updatedConvs = [...prev];
        updatedConvs[existingConvIndex] = {
          ...updatedConvs[existingConvIndex],
          messages: [...updatedConvs[existingConvIndex].messages, newMessage],
          lastMessage: messageText,
          lastActivity: new Date().toISOString()
        };
        return updatedConvs;
      } else {
        return [
          ...prev,
          {
            hostId,
            hostName,
            hostAvatar,
            messages: [newMessage],
            lastMessage: messageText,
            lastActivity: new Date().toISOString()
          }
        ];
      }
    });
  };

  const value = {
    joinedEvents,
    joinEvent,
    isJoined,
    conversations,
    sendMessage,
    unreadCount: 0 // Placeholder
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
