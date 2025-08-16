import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { websocketService } from '../services/websocket.service';

export interface Notification {
  id: string;
  type: 'message' | 'system' | 'request' | 'job_assigned' | 'job_completed';
  title: string;
  message: string;
  chatId?: string;
  senderId?: string;
  senderName?: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  data?: any; // Additional data from backend
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize WebSocket listeners when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    setupWebSocketListeners();
    loadInitialNotifications();

    return () => {
      cleanupWebSocketListeners();
    };
  }, [isAuthenticated, user]);

  const setupWebSocketListeners = () => {
    // Listen for new chat messages
    websocketService.onMessage('chat_message', (data: any) => {
      if (!user) return;

      // Only create notification if message is not from current user
      const messageSenderId = data.senderId?.toString();
      const currentUserId = user.id.toString();

      if (messageSenderId !== currentUserId) {
        addNotification({
          type: 'message',
          title: `New message from ${data.senderName || 'User'}`,
          message: data.content,
          chatId: data.chatId,
          senderId: messageSenderId,
          senderName: data.senderName,
          avatar: data.senderAvatar,
          data: data
        });
      }
    });

    // Listen for job assignments
    websocketService.onMessage('job_assigned', (data: any) => {
      addNotification({
        type: 'job_assigned',
        title: 'New Job Assignment',
        message: `You have been assigned to: ${data.serviceName}`,
        data: data
      });
    });

    // Listen for job completions
    websocketService.onMessage('job_completed', (data: any) => {
      addNotification({
        type: 'job_completed',
        title: 'Job Completed',
        message: `Job "${data.serviceName}" has been marked as completed`,
        data: data
      });
    });

    // Listen for new service requests (for CGs)
    websocketService.onMessage('new_service_request', (data: any) => {
      if (user?.type === 'cg') {
        addNotification({
          type: 'request',
          title: 'New Service Request',
          message: `New ${data.category} request in your area`,
          data: data
        });
      }
    });

    // Listen for request status updates
    websocketService.onMessage('request_status_updated', (data: any) => {
      const statusMessages = {
        'accepted': 'Your request has been accepted',
        'in_progress': 'Work has started on your request',
        'completed': 'Your request has been completed',
        'cancelled': 'Your request has been cancelled'
      };

      const message = statusMessages[data.status as keyof typeof statusMessages] || 'Request status updated';

      addNotification({
        type: 'system',
        title: 'Request Update',
        message: message,
        data: data
      });
    });

    // Listen for chat creation
    websocketService.onMessage('chat_created', (data: any) => {
      if (!user) return;

      const currentUserId = user.id.toString();
      const isInitiator = data.initiatorId?.toString() === currentUserId;

      if (!isInitiator) {
        // Someone else started a chat with you
        const initiatorName = data.initiatorName || 'User';
        addNotification({
          type: 'message',
          title: 'New Conversation',
          message: `${initiatorName} started a conversation with you`,
          chatId: data.id.toString(),
          senderId: data.initiatorId?.toString(),
          senderName: initiatorName,
          data: data
        });
      }
    });
  };

  const cleanupWebSocketListeners = () => {
    websocketService.offMessage('chat_message');
    websocketService.offMessage('job_assigned');
    websocketService.offMessage('job_completed');
    websocketService.offMessage('new_service_request');
    websocketService.offMessage('request_status_updated');
    websocketService.offMessage('chat_created');
  };

  const loadInitialNotifications = async () => {
    // In a real implementation, you might load recent notifications from the backend
    // For now, we'll start with an empty state and rely on WebSocket for new notifications
    setLoading(true);
    try {
      // Simulate loading recent notifications from backend
      // const recentNotifications = await notificationService.getRecentNotifications();
      // setNotifications(recentNotifications);
    } catch (error) {
      console.error('Failed to load initial notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      // Prevent duplicate notifications for the same message
      if (notification.type === 'message' && notification.chatId) {
        const existingMessageNotification = prev.find(n => 
          n.type === 'message' && 
          n.chatId === notification.chatId && 
          n.message === notification.message &&
          n.senderId === notification.senderId
        );
        
        if (existingMessageNotification) {
          return prev;
        }
      }

      return [newNotification, ...prev];
    });

    // Auto-remove system notifications after 10 seconds
    if (notification.type === 'system' || notification.type === 'job_assigned' || notification.type === 'job_completed') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }

    // Show browser notification if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/helmet-icon.svg',
        badge: '/helmet-icon.svg',
        tag: notification.chatId || notification.type,
        requireInteraction: notification.type === 'message'
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Request notification permission when component mounts
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
      loading
    }}>
      {children}
    </NotificationContext.Provider>
  );
};