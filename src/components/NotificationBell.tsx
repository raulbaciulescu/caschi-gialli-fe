import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../contexts/NotificationContext';
import { useOnlineStatus } from '../contexts/OnlineStatusContext';
import { Bell, MessageSquare, X, Check, CheckCheck, Clock, User, Briefcase, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, loading } = useNotifications();
  const { isUserOnline } = useOnlineStatus();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'message':
        if (notification.chatId) {
          navigate('/chat');
          setIsOpen(false);
        }
        break;
      case 'job_assigned':
      case 'job_completed':
      case 'request':
        navigate('/dashboard');
        setIsOpen(false);
        break;
      case 'system':
        break;
      default:
        break;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Acum';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageSquare;
      case 'job_assigned':
      case 'request':
        return Briefcase;
      case 'job_completed':
        return CheckCircle;
      case 'system':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'from-blue-400 to-blue-600';
      case 'job_assigned':
      case 'request':
        return 'from-yellow-400 to-yellow-600';
      case 'job_completed':
        return 'from-green-400 to-green-600';
      case 'system':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getNotificationDescription = (notification: any) => {
    switch (notification.type) {
      case 'message':
        return 'Apasă pentru a vedea conversația';
      case 'job_assigned':
        return 'Apasă pentru a vedea detaliile job-ului';
      case 'job_completed':
        return 'Apasă pentru a vedea job-ul finalizat';
      case 'request':
        return 'Apasă pentru a vedea cererea';
      case 'system':
        return 'Notificare sistem';
      default:
        return '';
    }
  };

  const recentNotifications = notifications.slice(0, isExpanded ? notifications.length : 5);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-100 group"
      >
        <Bell className="h-6 w-6 group-hover:animate-pulse" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {loading && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full animate-ping"></div>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-yellow-600" />
                    Notificări
                  </h3>
                  <p className="text-sm text-gray-600">
                    {unreadCount > 0 
                      ? `${unreadCount} notificare${unreadCount === 1 ? '' : 'i'} necitit${unreadCount === 1 ? 'ă' : 'e'}`
                      : 'Toate notificările sunt citite! 🎉'
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      className="text-xs text-yellow-600 hover:text-yellow-700 font-medium transition-colors flex items-center px-2 py-1 rounded-lg hover:bg-yellow-100"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Marchează toate
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Se încarcă notificările...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nicio notificare încă</p>
                  <p className="text-gray-400 text-sm mt-1">Vei vedea aici mesajele și actualizările noi</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentNotifications.map(notification => {
                    const IconComponent = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);
                    const senderIsOnline = notification.senderId ? isUserOnline(notification.senderId) : false;
                    
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 group ${
                          !notification.read ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                        }`}
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
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-yellow-700 transition-colors">
                                {notification.title}
                              </p>
                              <div className="flex items-center space-x-2">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-200"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 truncate mt-1 group-hover:text-gray-700 transition-colors">
                              {notification.message}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {getNotificationDescription(notification)}
                            </p>
                            
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      navigate('/chat');
                      setIsOpen(false);
                    }}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors flex items-center"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Vezi toate mesajele
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {notifications.length > 5 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-gray-600 hover:text-gray-700 transition-colors flex items-center px-2 py-1 rounded-lg hover:bg-gray-200"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Arată mai puține
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Arată toate ({notifications.length})
                          </>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        markAllAsRead();
                        setTimeout(() => setIsOpen(false), 300);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-700 transition-colors flex items-center px-2 py-1 rounded-lg hover:bg-gray-200"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Șterge toate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;