import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../contexts/OnlineStatusContext';

interface OnlineStatusIndicatorProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({
  userId,
  size = 'md',
  showText = false,
  className = ''
}) => {
  const { isUserOnline, getUserLastSeen } = useOnlineStatus();
  const { t } = useTranslation();
  
  const isOnline = isUserOnline(userId);
  const lastSeen = getUserLastSeen(userId);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const formatLastSeen = (date: Date | null) => {
    if (!date) return t('status.unknown') || 'Unknown';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('common.now') || 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full ${
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      } ${isOnline ? 'animate-pulse' : ''}`}></div>
      
      {showText && (
        <span className={`ml-2 text-xs ${
          isOnline ? 'text-green-600' : 'text-gray-500'
        }`}>
          {isOnline ? t('status.online') : t('status.lastSeen', { time: formatLastSeen(lastSeen) })}
        </span>
      )}
    </div>
  );
};

export default OnlineStatusIndicator;