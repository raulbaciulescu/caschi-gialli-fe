import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { useOnlineStatus } from '../contexts/OnlineStatusContext';
import { X, MessageSquare, Bell, CheckCircle, AlertTriangle, Briefcase, User } from 'lucide-react';

const NotificationToast: React.FC = () => {
  const { notifications } = useNotifications();
  const { isUserOnline } = useOnlineStatus();
  const navigate = useNavigate();
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

  // Show toast for new unread notifications
  useEffect(() => {
    const newUnreadNotifications = notifications.filter(n => 
      !n.read && 
      !visibleToasts.includes(n.id) &&
      (n.type === 'message' || n.type === 'job_assigned' || n.type === 'job_completed') // Show toasts for important notifications
    );

    if (newUnreadNotifications.length > 0) {
      const newToastIds = newUnreadNotifications.map(n => n.id);
      setVisibleToasts(prev => [...prev, ...newToastIds]);

      // Auto-hide toasts after 6 seconds
      newToastIds.forEach(toastId => {
        setTimeout(() => {
          setVisibleToasts(prev => prev.filter(id => id !== toastId));
        }, 6000);
      });
    }
  }, [notifications]);

  const hideToast = (toastId: string) => {
    setVisibleToasts(prev => prev.filter(id => id !== toastId));
  };

  const handleToastClick = (notification: any) => {
    hideToast(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        navigate('/chat');
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
      case 'message':
        return MessageSquare;
      case 'job_assigned':
        return Briefcase;
      case 'job_completed':
        return CheckCircle;
      case 'system':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'from-blue-500 to-blue-600';
      case 'job_assigned':
        return 'from-yellow-500 to-yellow-600';
      case 'job_completed':
        return 'from-green-500 to-green-600';
      case 'system':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
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
              {/* Icon/Avatar */}
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
                
                {/* Online Status Indicator */}
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
                      hideToast(notification.id);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2 p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(notification.timestamp)}
                  </p>
                  
                  {notification.senderId && (
                    <div className="flex items-center text-xs">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        senderIsOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className={senderIsOnline ? 'text-green-600' : 'text-gray-500'}>
                        {senderIsOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action hint */}
                <div className="mt-2 text-xs text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to {notification.type === 'message' ? 'view conversation' : 'view details'} →
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