import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { websocketService } from '../services/websocket.service';
import { notificationService, ServerNotificationDto } from '../services/notification.service';
import { t } from 'i18next';

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
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    const onChatCreated = (data: any) => {
      const currentUserId = user.id.toString();
      const isInitiator = data.initiatorId?.toString() === currentUserId;
      if (isInitiator) return;

      const initiatorName = data.initiatorName || 'Utilizator';
      addNotification({
        type: 'message',
        title: 'Conversație Nouă',
        message: `${initiatorName} a început o conversație cu tine`,
        chatId: String(data.id),
        senderId: data.initiatorId?.toString(),
        senderName: initiatorName,
        data
      });
    };

    const onJobAssigned = (data: any) => {
      addNotification({
        type: 'job_assigned',
        title: 'Job Nou Asignat',
        message: `Ai fost asignat la: ${data.serviceName}`,
        data
      });
    };

    const onJobCompleted = (data: any) => {
      addNotification({
        type: 'job_completed',
        title: 'Job Finalizat',
        message: `Job-ul "${data.serviceName}" a fost marcat ca finalizat`,
        data
      });
    };

    const onNewServiceRequest = (data: any) => {
      if (user?.type === 'cg') {
        addNotification({
          type: 'request',
          title: 'Cerere Nouă de Serviciu',
          message: `Cerere nouă ${data.category} în zona ta`,
          data
        });
      }
    };

    const onRequestStatusUpdated = (data: any) => {
      const statusMessages: Record<string, string> = {
        accepted: 'Cererea ta a fost acceptată',
        in_progress: 'Lucrul a început la cererea ta',
        completed: 'Cererea ta a fost finalizată',
        cancelled: 'Cererea ta a fost anulată'
      };
      const msg = statusMessages[data.status] || 'Status cerere actualizat';
      addNotification({
        type: 'system',
        title: 'Actualizare Cerere',
        message: msg,
        data
      });
    };

    websocketService.onMessage('chat_created', onChatCreated);
    websocketService.onMessage('job_assigned', onJobAssigned);
    websocketService.onMessage('job_completed', onJobCompleted);
    websocketService.onMessage('new_service_request', onNewServiceRequest);
    websocketService.onMessage('request_status_updated', onRequestStatusUpdated);

    // debug hooks — păstrează dacă le emiți
    websocketService.onMessage('message_delivered', (d: any) => console.log('Message delivered:', d));
    websocketService.onMessage('message_read', (d: any) => console.log('Message read:', d));
    websocketService.onMessage('unread_count', (d: any) => console.log('Unread count updated:', d));

    // 2) Pull PENDING la login + când revii pe tab
    pullPending().catch(console.error);
    const onVisible = () => {
      if (document.visibilityState === 'visible') pullPending().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);

    // Cleanup: NU dezabonăm 'chat_message' aici (e în ChatProvider).
    return () => {
      // Dacă websocketService.offMessage acceptă și callback, folosește-l:
      // websocketService.offMessage('chat_created', onChatCreated) etc.
      websocketService.offMessage('chat_created');
      websocketService.offMessage('job_assigned');
      websocketService.offMessage('job_completed');
      websocketService.offMessage('new_service_request');
      websocketService.offMessage('request_status_updated');
      websocketService.offMessage('message_delivered');
      websocketService.offMessage('message_read');
      websocketService.offMessage('unread_count');
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }, []);

  const pullPending = async () => {
    setLoading(true);
    try {
      const list: ServerNotificationDto[] = await notificationService.fetchPending(50);
      for (const n of list) {
        addNotification(notificationService.toUi(n, t));
      }
      await notificationService.markManyDelivered(list, 'REST');
    } catch (e) {
      console.error('pullPending failed', e);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const serverId = notification.data?.notificationId as number | undefined;

    const newNotification: Notification = {
      ...notification,
      id: serverId ? String(serverId) : Date.now().toString() + Math.random().toString(36).slice(2),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      // Dedup pe message-type + chat + mesaj + sender (pentru MESSAGE_NEW)
      if (notification.type === 'message' && notification.chatId) {
        const exists = prev.find(n =>
            n.type === 'message' &&
            n.chatId === notification.chatId &&
            n.message === notification.message &&
            n.senderId === notification.senderId
        );
        if (exists) return prev;
      }
      // Dedup pe id de server
      if (serverId && prev.some(n => n.id === String(serverId))) return prev;
      return [newNotification, ...prev];
    });

    // Auto-dismiss pentru unele tipuri
    if (notification.type === 'system' || notification.type === 'job_assigned' || notification.type === 'job_completed') {
      setTimeout(() => removeNotification(newNotification.id), 10000);
    }

    // Browser Notification (permisiuni)
    if ('Notification' in window && window.Notification.permission === 'granted') {
      try {
        new window.Notification(notification.title, {
          body: notification.message,
          icon: '/helmet-icon.svg',
          badge: '/helmet-icon.svg',
          tag: notification.chatId || notification.type,
          requireInteraction: notification.type === 'message'
        });
      } catch { /* ignore */ }
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );

    const n = notifications.find(x => x.id === notificationId);
    const serverId = n?.data?.notificationId as number | undefined;
    if (serverId) {
      notificationService.markSeen(serverId).catch(console.error);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const serverIds = notifications
        .map(n => n.data?.notificationId as number | undefined)
        .filter((id): id is number => typeof id === 'number');
    Promise.allSettled(serverIds.map(id => notificationService.markSeen(id))).catch(() => {});
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => setNotifications([]);

  const value = useMemo<NotificationContextType>(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    loading
  }), [notifications, unreadCount, loading]);

  return (
      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
  );
};
