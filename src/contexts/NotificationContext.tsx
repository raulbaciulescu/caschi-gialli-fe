import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useChat } from './ChatContext';

export interface Notification {
  id: string;
  type: 'message' | 'system' | 'request';
  title: string;
  message: string;
  chatId?: string;
  senderId?: string;
  senderName?: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
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
  const { user } = useAuth();
  const { chats, messages } = useChat();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Listen for new messages and create notifications
  useEffect(() => {
    if (!user) return;

    // Check for new messages in all chats
    chats.forEach(chat => {
      const chatMessages = messages[chat.id] || [];
      const lastMessage = chatMessages[chatMessages.length - 1];

      if (lastMessage && lastMessage.senderId !== user.id.toString()) {
        // Check if we already have a notification for this message
        const existingNotification = notifications.find(n => 
          n.type === 'message' && 
          n.chatId === chat.id && 
          n.message === lastMessage.content
        );

        if (!existingNotification) {
          // Get sender name from chat data
          const senderName = lastMessage.senderId === chat.customerId 
            ? chat.customerName 
            : chat.cgName;

          addNotification({
            type: 'message',
            title: `New message from ${senderName}`,
            message: lastMessage.content,
            chatId: chat.id,
            senderId: lastMessage.senderId,
            senderName: senderName
          });
        }
      }
    });
  }, [messages, chats, user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove notification after 10 seconds if not a message notification
    if (notification.type !== 'message') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
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

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};