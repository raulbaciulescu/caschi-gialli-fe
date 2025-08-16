import React from 'react';
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
  
  const isOnline = isUserOnline(userId);
  const lastSeen = getUserLastSeen(userId);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const formatLastSeen = (date: Date | null) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
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
          {isOnline ? 'Online' : `Last seen ${formatLastSeen(lastSeen)}`}
        </span>
      )}
    </div>
  );
};

export default OnlineStatusIndicator;