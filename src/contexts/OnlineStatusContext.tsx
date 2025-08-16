import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { websocketService } from '../services/websocket.service';

interface OnlineUser {
  userId: string;
  userName: string;
  lastSeen: Date;
  isOnline: boolean;
  avatar?: string;
}

interface OnlineStatusContextType {
  onlineUsers: Map<string, OnlineUser>;
  isUserOnline: (userId: string) => boolean;
  getUserLastSeen: (userId: string) => Date | null;
  setUserOnline: (userId: string, userName: string, avatar?: string) => void;
  setUserOffline: (userId: string) => void;
  updateUserActivity: (userId: string) => void;
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
  const { user, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map());

  // Setup WebSocket listeners for online status updates
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOnlineUsers(new Map());
      return;
    }

    setupWebSocketListeners();
    
    // Mark current user as online
    setUserOnline(user.id.toString(), user.name, user.profileImage);

    // Send heartbeat every 30 seconds to maintain online status
    const heartbeatInterval = setInterval(() => {
      if (websocketService.connected) {
        websocketService.sendHeartbeat?.();
      }
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      cleanupWebSocketListeners();
    };
  }, [isAuthenticated, user]);

  const setupWebSocketListeners = () => {
    // Listen for user online status updates
    websocketService.onMessage('user_online', (data: any) => {
      setUserOnline(data.userId, data.userName, data.avatar);
    });

    // Listen for user offline status updates
    websocketService.onMessage('user_offline', (data: any) => {
      setUserOffline(data.userId);
    });

    // Listen for user activity updates
    websocketService.onMessage('user_activity', (data: any) => {
      updateUserActivity(data.userId);
    });

    // Listen for bulk online users list (sent on connection)
    websocketService.onMessage('online_users_list', (data: any) => {
      if (data.users && Array.isArray(data.users)) {
        const newOnlineUsers = new Map<string, OnlineUser>();
        
        data.users.forEach((userData: any) => {
          newOnlineUsers.set(userData.userId, {
            userId: userData.userId,
            userName: userData.userName,
            lastSeen: new Date(userData.lastSeen),
            isOnline: userData.isOnline,
            avatar: userData.avatar
          });
        });
        
        setOnlineUsers(newOnlineUsers);
      }
    });
  };

  const cleanupWebSocketListeners = () => {
    websocketService.offMessage('user_online');
    websocketService.offMessage('user_offline');
    websocketService.offMessage('user_activity');
    websocketService.offMessage('online_users_list');
  };

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

  const setUserOnline = (userId: string, userName: string, avatar?: string) => {
    setOnlineUsers(prev => {
      const newMap = new Map(prev);
      newMap.set(userId, {
        userId,
        userName,
        lastSeen: new Date(),
        isOnline: true,
        avatar
      });
      return newMap;
    });

    // Send online status to backend via WebSocket
    if (websocketService.connected && user && userId === user.id.toString()) {
      websocketService.sendUserStatus?.('online');
    }
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

    // Send offline status to backend via WebSocket
    if (websocketService.connected && user && userId === user.id.toString()) {
      websocketService.sendUserStatus?.('offline');
    }
  };

  const updateUserActivity = (userId: string) => {
    setOnlineUsers(prev => {
      const newMap = new Map(prev);
      const existingUser = newMap.get(userId);
      if (existingUser) {
        newMap.set(userId, {
          ...existingUser,
          lastSeen: new Date(),
          isOnline: true
        });
      }
      return newMap;
    });
  };

  // Send activity heartbeat when user interacts with the page
  useEffect(() => {
    if (!user || !websocketService.connected) return;

    const handleUserActivity = () => {
      updateUserActivity(user.id.toString());
      websocketService.sendUserActivity?.();
    };

    // Listen for user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    let activityTimeout: NodeJS.Timeout;
    const throttledActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(handleUserActivity, 1000); // Throttle to once per second
    };

    events.forEach(event => {
      document.addEventListener(event, throttledActivity, { passive: true });
    });

    return () => {
      clearTimeout(activityTimeout);
      events.forEach(event => {
        document.removeEventListener(event, throttledActivity);
      });
    };
  }, [user, websocketService.connected]);

  return (
    <OnlineStatusContext.Provider value={{
      onlineUsers,
      isUserOnline,
      getUserLastSeen,
      setUserOnline,
      setUserOffline,
      updateUserActivity
    }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};