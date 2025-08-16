import { useState, useCallback, useEffect } from 'react';
import { notificationService, BackendNotification } from '../services/notification.service';
import { useAuth } from '../contexts/AuthContext';

interface UseNotificationsState {
  notifications: BackendNotification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

interface UseNotificationsReturn extends UseNotificationsState {
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<UseNotificationsState>({
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0,
  });

  const loadNotifications = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const notifications = await notificationService.getRecentNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;

      setState(prev => ({
        ...prev,
        notifications,
        unreadCount,
        loading: false,
      }));
    } catch (error) {
      let errorMessage = 'Failed to load notifications';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [isAuthenticated, user]);

  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      await notificationService.markAllAsRead();
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string): Promise<void> => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      setState(prev => {
        const notification = prev.notifications.find(n => n.id === notificationId);
        const wasUnread = notification && !notification.read;
        
        return {
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount
        };
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    await loadNotifications();
  }, [loadNotifications]);

  // Load notifications when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
    } else {
      setState({
        notifications: [],
        loading: false,
        error: null,
        unreadCount: 0,
      });
    }
  }, [isAuthenticated, user, loadNotifications]);

  return {
    ...state,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  };
}