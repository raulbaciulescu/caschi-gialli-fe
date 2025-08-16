import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface OnlineUser {
  userId: string;
  userName: string;
  lastSeen: Date;
  isOnline: boolean;
}

interface OnlineStatusContextType {
  onlineUsers: Map<string, OnlineUser>;
  isUserOnline: (userId: string) => boolean;
  getUserLastSeen: (userId: string) => Date | null;
  setUserOnline: (userId: string, userName: string) => void;
  setUserOffline: (userId: string) => void;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error('useOnlineStatus must be used within an OnlineStatusProvider');
  }
  return context;
};

export const OnlineStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map());

  // Simulate online status updates (in a real app, this would come from WebSocket)
  useEffect(() => {
    if (!user) return;

    // Mark current user as online
    setUserOnline(user.id.toString(), user.name);

    // Simulate some other users being online
    const simulateOnlineUsers = () => {
      const mockOnlineUsers = [
        { id: '151', name: 'CG Professional' },
        { id: 'cg-2', name: 'Anna Verdi' },
        { id: '552', name: 'Client User' }
      ];

      mockOnlineUsers.forEach(mockUser => {
        if (mockUser.id !== user.id.toString()) {
          // Randomly set users as online/offline
          const isOnline = Math.random() > 0.3;
          if (isOnline) {
            setUserOnline(mockUser.id, mockUser.name);
          } else {
            setUserOffline(mockUser.id);
          }
        }
      });
    };

    simulateOnlineUsers();

    // Update online status every 30 seconds
    const interval = setInterval(simulateOnlineUsers, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const isUserOnline = (userId: string): boolean => {
    const userStatus = onlineUsers.get(userId);
    if (!userStatus) return false;
    
    // Consider user offline if last seen more than 5 minutes ago
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return userStatus.isOnline && userStatus.lastSeen > fiveMinutesAgo;
  };

  const getUserLastSeen = (userId: string): Date | null => {
    const userStatus = onlineUsers.get(userId);
    return userStatus ? userStatus.lastSeen : null;
  };

  const setUserOnline = (userId: string, userName: string) => {
    setOnlineUsers(prev => {
      const newMap = new Map(prev);
      newMap.set(userId, {
        userId,
        userName,
        lastSeen: new Date(),
        isOnline: true
      });
      return newMap;
    });
  };

  const setUserOffline = (userId: string) => {
    setOnlineUsers(prev => {
      const newMap = new Map(prev);
      const existingUser = newMap.get(userId);
      if (existingUser) {
        newMap.set(userId, {
          ...existingUser,
          isOnline: false,
          lastSeen: new Date()
        });
      }
      return newMap;
    });
  };

  return (
    <OnlineStatusContext.Provider value={{
      onlineUsers,
      isUserOnline,
      getUserLastSeen,
      setUserOnline,
      setUserOffline
    }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};