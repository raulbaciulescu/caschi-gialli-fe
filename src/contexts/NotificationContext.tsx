import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { websocketService } from '../services/websocket.service';
import { API_CONFIG } from '../config/api';
import {t} from "i18next";

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
  data?: any; // include aici notificationId (server), kind, etc.
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

// ---- REST helpers (MVP) ----
type ServerNotifStatus = 'PENDING' | 'DELIVERED' | 'SEEN' | 'DISMISSED';
type ServerNotifKind = 'MESSAGE_NEW' | 'CHAT_CREATED';
interface ServerNotificationDto {
  id: number;
  kind: ServerNotifKind;
  chatId?: number;
  messageId?: number;
  fromUserId?: number;
  preview?: string;
  createdAt: string;
  status: ServerNotifStatus;
}

const BASE = API_CONFIG.BASE_URL;

async function fetchPending(limit = 50): Promise<ServerNotificationDto[]> {
  const res = await fetch(`${BASE}/notifications?status=PENDING&limit=${limit}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

async function markDelivered(id: number, channel: 'REST' | 'WS' = 'REST'): Promise<void> {
  await fetch(`${BASE}/notifications/${id}/delivered?channel=${channel}`, {
    method: 'PATCH',
    credentials: 'include'
  });
}

async function markSeen(id: number): Promise<void> {
  await fetch(`${BASE}/notifications/${id}/seen`, {
    method: 'PATCH',
    credentials: 'include'
  });
}

async function markSeenByChat(chatId: number): Promise<void> {
  await fetch(`${BASE}/notifications/seen/by-chat/${chatId}`, {
    method: 'POST',
    credentials: 'include'
  });
}

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
    // PULL offline la login
    pullPending().catch(console.error);

    const onVisible = () => {
      if (document.visibilityState === 'visible') pullPending().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cleanupWebSocketListeners();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [isAuthenticated, user?.id]);

  const setupWebSocketListeners = () => {
    websocketService.onMessage('chat_message', (data: any) => {
      if (!user) return;

      const messageSenderId = data.senderId?.toString();
      const currentUserId = user.id.toString();

      if (messageSenderId !== currentUserId && data.notificationId) {
        if (typeof (websocketService as any).acknowledgeNotification === 'function') {
          (websocketService as any).acknowledgeNotification(String(data.notificationId));
        } else if (typeof (websocketService as any).acknowledgeNotification === 'function') {
          (websocketService as any).acknowledgeMessage(String(data.notificationId), currentUserId);
        }
      }

      if (messageSenderId !== currentUserId) {
        addNotification({
          type: 'message',
          title: t('notifications.newMessage2'),
          // title: `New message from ${data.senderName || 'User'}`,
          message: data.content,
          chatId: String(data.chatId),
          senderId: messageSenderId,
          senderName: data.senderName,
          avatar: data.senderAvatar,
          data
        });
      }
    });

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
          chatId: String(data.id),
          senderId: data.initiatorId?.toString(),
          senderName: initiatorName,
          data
        });
      }
    });

    // Exemple păstrate — dacă le emiți pe WS
    websocketService.onMessage('job_assigned', (data: any) => {
      addNotification({
        type: 'job_assigned',
        title: 'Job Nou Asignat',
        message: `Ai fost asignat la: ${data.serviceName}`,
        data
      });
    });

    websocketService.onMessage('job_completed', (data: any) => {
      addNotification({
        type: 'job_completed',
        title: 'Job Finalizat',
        message: `Job-ul "${data.serviceName}" a fost marcat ca finalizat`,
        data
      });
    });

    websocketService.onMessage('new_service_request', (data: any) => {
      if (user?.type === 'cg') {
        addNotification({
          type: 'request',
          title: 'Cerere Nouă de Serviciu',
          message: `Cerere nouă ${data.category} în zona ta`,
          data
        });
      }
    });

    websocketService.onMessage('request_status_updated', (data: any) => {
      const statusMessages: Record<string, string> = {
        accepted: 'Cererea ta a fost acceptată',
        in_progress: 'Lucrul a început la cererea ta',
        completed: 'Cererea ta a fost finalizată',
        cancelled: 'Cererea ta a fost anulată'
      };
      const message = statusMessages[data.status] || 'Status cerere actualizat';
      addNotification({
        type: 'system',
        title: 'Actualizare Cerere',
        message,
        data
      });
    });

    // debug hooks — păstrează dacă le emiți
    websocketService.onMessage('message_delivered', (d: any) => console.log('Message delivered:', d));
    websocketService.onMessage('message_read', (d: any) => console.log('Message read:', d));
    websocketService.onMessage('unread_count', (d: any) => console.log('Unread count updated:', d));
  };

  const cleanupWebSocketListeners = () => {
    websocketService.offMessage('chat_message');
    websocketService.offMessage('chat_created');
    websocketService.offMessage('job_assigned');
    websocketService.offMessage('job_completed');
    websocketService.offMessage('new_service_request');
    websocketService.offMessage('request_status_updated');
    websocketService.offMessage('message_delivered');
    websocketService.offMessage('message_read');
    websocketService.offMessage('unread_count');
  };

  // PULL “offline” din REST + marcare DELIVERED (REST) după afișare
  const pullPending = async () => {
    try {
      setLoading(true);
      const list = await fetchPending(50);

      // 1) adaugă în UI (folosim id din server ca să evităm duplicate)
      for (const n of list) {
        addNotification(mapServerDtoToUi(n));
      }

      // 2) marchează DELIVERED pe REST după ce le-ai afișat
      await Promise.allSettled(list.map(n => markDelivered(n.id, 'REST')));
    } catch (e) {
      console.error('pullPending failed', e);
    } finally {
      setLoading(false);
    }
  };

  const mapServerDtoToUi = (dto: ServerNotificationDto): Omit<Notification, 'id' | 'timestamp' | 'read'> => {
    const isMessage = dto.kind === 'MESSAGE_NEW';
    const title = isMessage ? t('notifications.newMessage2') : 'New conversation';
    const message = dto.preview ?? (isMessage ? t('notifications.newMessage2') : 'New chat');
    return {
      type: isMessage ? 'message' : 'system',
      title,
      message,
      chatId: dto.chatId ? String(dto.chatId) : undefined,
      senderId: dto.fromUserId ? String(dto.fromUserId) : undefined,
      data: {
        notificationId: dto.id,
        kind: dto.kind,
        chatId: dto.chatId,
        messageId: dto.messageId,
        createdAt: dto.createdAt,
        status: dto.status
      }
    };
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
      if (notification.type === 'message' && notification.chatId) {
        const exists = prev.find(n =>
            n.type === 'message' &&
            n.chatId === notification.chatId &&
            n.message === notification.message &&
            n.senderId === notification.senderId
        );
        if (exists) return prev;
      }

      if (serverId && prev.some(n => n.id === String(serverId))) return prev;
      return [newNotification, ...prev];
    });

    if (notification.type === 'system' || notification.type === 'job_assigned' || notification.type === 'job_completed') {
      setTimeout(() => removeNotification(newNotification.id), 10000);
    }

    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(notification.title, {
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
            notification.id === notificationId ? { ...notification, read: true } : notification
        )
    );

    const n = notifications.find(x => x.id === notificationId);
    const serverId = n?.data?.notificationId as number | undefined;
    if (serverId) {
      markSeen(serverId).catch(console.error);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    const serverIds = notifications
        .map(n => n.data?.notificationId as number | undefined)
        .filter((id): id is number => typeof id === 'number');
    Promise.allSettled(serverIds.map(id => markSeen(id))).catch(() => {});
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
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
