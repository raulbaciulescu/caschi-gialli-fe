import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { X, MessageSquare, Bell, CheckCircle, AlertCircle } from 'lucide-react';

const NotificationToast: React.FC = () => {
  const { notifications } = useNotifications();
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

  // Show toast for new unread notifications
  useEffect(() => {
    const newUnreadNotifications = notifications.filter(n => 
      !n.read && 
      !visibleToasts.includes(n.id) &&
      n.type === 'message' // Only show toasts for messages
    );

    if (newUnreadNotifications.length > 0) {
      const newToastIds = newUnreadNotifications.map(n => n.id);
      setVisibleToasts(prev => [...prev, ...newToastIds]);

      // Auto-hide toasts after 5 seconds
      newToastIds.forEach(toastId => {
        setTimeout(() => {
          setVisibleToasts(prev => prev.filter(id => id !== toastId));
        }, 5000);
      });
    }
  }, [notifications]);

  const hideToast = (toastId: string) => {
    setVisibleToasts(prev => prev.filter(id => id !== toastId));
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageSquare;
      case 'system':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'from-blue-500 to-blue-600';
      case 'system':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const visibleNotifications = notifications.filter(n => visibleToasts.includes(n.id));

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map(notification => {
        const IconComponent = getToastIcon(notification.type);
        const colorClass = getToastColor(notification.type);

        return (
          <div
            key={notification.id}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm transform transition-all duration-300 hover:scale-105"
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {notification.message}
                </p>
              </div>
              
              <button
                onClick={() => hideToast(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;