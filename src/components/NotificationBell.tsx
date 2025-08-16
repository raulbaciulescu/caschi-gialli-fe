import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../contexts/NotificationContext';
import { useOnlineStatus } from '../contexts/OnlineStatusContext';
import { Bell, MessageSquare, X, Check, CheckCheck, Clock, User } from 'lucide-react';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const { isUserOnline } = useOnlineStatus();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    if (notification.type === 'message' && notification.chatId) {
      navigate('/chat');
      setIsOpen(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageSquare;
      default:
        return Bell;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
      >
        <Bell className="h-6 w-6" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">
                    {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up!'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-yellow-600 hover:text-yellow-700 font-medium transition-colors flex items-center"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-gray-400 text-sm mt-1">You'll see new messages and updates here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(notification => {
                    const IconComponent = getNotificationIcon(notification.type);
                    const senderIsOnline = notification.senderId ? isUserOnline(notification.senderId) : false;
                    
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                          !notification.read ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar/Icon */}
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                              {notification.avatar ? (
                                <img
                                  src={notification.avatar}
                                  alt={notification.senderName}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : notification.type === 'message' ? (
                                <User className="h-5 w-5 text-white" />
                              ) : (
                                <IconComponent className="h-5 w-5 text-white" />
                              )}
                            </div>
                            
                            {/* Online Status Indicator */}
                            {notification.senderId && senderIsOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <div className="flex items-center space-x-2">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {notification.message}
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

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      navigate('/chat');
                      setIsOpen(false);
                    }}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                  >
                    View all messages
                  </button>
                  <button
                    onClick={() => {
                      markAllAsRead();
                      setTimeout(() => setIsOpen(false), 300);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-700 transition-colors flex items-center"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Clear all
                  </button>
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