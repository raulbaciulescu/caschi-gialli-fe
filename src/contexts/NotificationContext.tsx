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
  data?: any;
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

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    setupWebSocketListeners();

    return () => {
      cleanupWebSocketListeners();
    };
  }, [isAuthenticated, user]);

  const setupWebSocketListeners = () => {
    // Handle incoming chat messages for notifications
    websocketService.onMessage('chat_message', (data: any) => {
      console.log('Received setup:', data);
      if (!user) return;

      const messageSenderId = data.senderId?.toString();
      const currentUserId = user.id.toString();

      // Only create notification for messages from others (not backfill)
      if (messageSenderId !== currentUserId) {
        addNotification({
          type: 'message',
          title: `Mesaj nou de la ${data.senderName || 'Utilizator'}`,
          message: data.content,
          chatId: data.chatId,
          senderId: messageSenderId,
          senderName: data.senderName,
          avatar: data.senderAvatar,
          data: data
        });
      }
    });

    // Handle job assignment notifications
    websocketService.onMessage('job_assigned', (data: any) => {
      addNotification({
        type: 'job_assigned',
        title: 'Job Nou Asignat',
        message: `Ai fost asignat la: ${data.serviceName}`,
        data: data
      });
    });

    // Handle job completion notifications
    websocketService.onMessage('job_completed', (data: any) => {
      addNotification({
        type: 'job_completed',
        title: 'Job Finalizat',
        message: `Job-ul "${data.serviceName}" a fost marcat ca finalizat`,
        data: data
      });
    });

    // Handle new service requests for CGs
    websocketService.onMessage('new_service_request', (data: any) => {
      if (user?.type === 'cg') {
        addNotification({
          type: 'request',
          title: 'Cerere Nouă de Serviciu',
          message: `Cerere nouă ${data.category} în zona ta`,
          data: data
        });
      }
    });

    // Handle request status updates
    websocketService.onMessage('request_status_updated', (data: any) => {
      const statusMessages = {
        'accepted': 'Cererea ta a fost acceptată',
        'in_progress': 'Lucrul a început la cererea ta',
        'completed': 'Cererea ta a fost finalizată',
        'cancelled': 'Cererea ta a fost anulată'
      };

      const message = statusMessages[data.status as keyof typeof statusMessages] || 'Status cerere actualizat';

      addNotification({
        type: 'system',
        title: 'Actualizare Cerere',
        message: message,
        data: data
      });
    });

    // Handle chat creation notifications
    websocketService.onMessage('chat_created', (data: any) => {
      if (!user) return;

      const currentUserId = user.id.toString();
      const isInitiator = data.initiatorId?.toString() === currentUserId;

      if (!isInitiator) {
        const initiatorName = data.initiatorName || 'Utilizator';
        addNotification({
          type: 'message',
          title: 'Conversație Nouă',
          message: `${initiatorName} a început o conversație cu tine`,
          chatId: data.id.toString(),
          senderId: data.initiatorId?.toString(),
          senderName: initiatorName,
          data: data
        });
      }
    });

    // Handle message delivery confirmations (optional - for debugging)
    websocketService.onMessage('message_delivered', (data: any) => {
      console.log('Message delivered:', data);
    });

    // Handle message read confirmations (optional - for debugging)
    websocketService.onMessage('message_read', (data: any) => {
      console.log('Message read:', data);
    });

    // Handle unread count updates (optional - for debugging)
    websocketService.onMessage('unread_count', (data: any) => {
      console.log('Unread count updated:', data);
    });
  };

    const cleanupWebSocketListeners = () => {
    websocketService.offMessage('chat_message');
    websocketService.offMessage('job_assigned');
    websocketService.offMessage('job_completed');
    websocketService.offMessage('new_service_request');
    websocketService.offMessage('request_status_updated');
    websocketService.offMessage('chat_created');
    websocketService.offMessage('message_delivered');
    websocketService.offMessage('message_read');
    websocketService.offMessage('unread_count');
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      // Prevent duplicate message notifications
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

    // Browser notification if permission granted
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

  // Request notification permission on mount
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