import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../contexts/NotificationContext';
import { useOnlineStatus } from '../contexts/OnlineStatusContext';
import { X, MessageSquare, Bell, CheckCircle, AlertTriangle, Briefcase, Clock } from 'lucide-react';

const NotificationToast: React.FC = () => {
  // ⬇️ folosim markAsRead din context (apelează și BE)
  const { notifications, markAsRead } = useNotifications(); // CHANGED
  const { isUserOnline } = useOnlineStatus();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

  useEffect(() => {
    const newUnreadNotifications = notifications.filter(n =>
        !n.read &&
        !visibleToasts.includes(n.id) &&
        (n.type === 'message' || n.type === 'job_assigned' || n.type === 'job_completed')
    );

    if (newUnreadNotifications.length > 0) {
      const newToastIds = newUnreadNotifications.map(n => n.id);
      setVisibleToasts(prev => [...prev, ...newToastIds]);

      newToastIds.forEach(toastId => {
        setTimeout(() => {
          // la auto-hide le marcăm ca read, ca să nu reapară și să sync cu BE
          setVisibleToasts(prev => prev.filter(id => id !== toastId));
          markAsRead(toastId); // CHANGED
        }, 6000);
      });
    }
  }, [notifications, visibleToasts, markAsRead]); // CHANGED: deps include markAsRead

  const hideToast = (toastId: string) => {
    setVisibleToasts(prev => prev.filter(id => id !== toastId));
    markAsRead(toastId); // CHANGED: dismiss => read (și BE)
  };

  const handleToastClick = (notification: any) => {
    hideToast(notification.id); // face și markAsRead
    switch (notification.type) {
      case 'message':
        notification.chatId ? navigate(`/chat?chatId=${notification.chatId}`) : navigate('/chat');
        break;
      case 'job_assigned':
      case 'job_completed':
        navigate('/dashboard');
        break;
      default:
        break;
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'job_assigned': return Briefcase;
      case 'job_completed': return CheckCircle;
      case 'system': return AlertTriangle;
      default: return Bell;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'message': return 'from-blue-500 to-blue-600';
      case 'job_assigned': return 'from-yellow-500 to-yellow-600';
      case 'job_completed': return 'from-green-500 to-green-600';
      case 'system': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // CHANGED: acceptă Date | string
  const formatTime = (raw: Date | string) => {
    const date = raw instanceof Date ? raw : new Date(raw);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return t('common.now') || 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  const visibleNotifications = notifications.filter(n => visibleToasts.includes(n.id));
  if (visibleNotifications.length === 0) return null;

  return (
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {visibleNotifications.map(notification => {
          const IconComponent = getToastIcon(notification.type);
          const colorClass = getToastColor(notification.type);
          const senderIsOnline = notification.senderId ? isUserOnline(notification.senderId) : false;

          return (
              <div
                  key={notification.id}
                  onClick={() => handleToastClick(notification)}
                  className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm transform transition-all duration-300 hover:scale-105 cursor-pointer group animate-slideInRight"
              >
                <div className="flex items-start space-x-3">
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center shadow-lg`}>
                      {notification.avatar ? (
                          <img
                              src={notification.avatar}
                              alt={notification.senderName}
                              className="w-full h-full object-cover rounded-full"
                          />
                      ) : (
                          <IconComponent className="h-5 w-5 text-white" />
                      )}
                    </div>
                    {notification.senderId && senderIsOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-yellow-700 transition-colors">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2 group-hover:text-gray-700 transition-colors">
                          {notification.message}
                        </p>
                      </div>

                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            hideToast(notification.id); // CHANGED
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors ml-2 p-1 rounded-lg hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(notification.timestamp)} {/* CHANGED */}
                      </p>

                      {notification.senderId && (
                          <div className="flex items-center text-xs">
                            <div className={`w-2 h-2 rounded-full mr-1 ${senderIsOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className={senderIsOnline ? 'text-green-600' : 'text-gray-500'}>
                        {senderIsOnline ? t('status.online') : t('status.offline')}
                      </span>
                          </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('notifications.clickToView') || 'Click to view'} →
                    </div>
                  </div>
                </div>
              </div>
          );
        })}
      </div>
  );
};

export default NotificationToast;
