import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useOnlineStatus } from '../contexts/OnlineStatusContext';
import OnlineStatusIndicator from '../components/OnlineStatusIndicator';
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Users, 
  Phone, 
  RefreshCw, 
  Check, 
  CheckCheck,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Image as ImageIcon,
  Plus,
  Settings,
  Archive,
  Trash2,
  Star,
  Info,
  Video,
  UserPlus,
  Bell,
  BellOff
} from 'lucide-react';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const {
    chats,
    activeChat,
    messages,
    setActiveChat,
    sendMessage,
    loading,
    refreshChats
  } = useChat();
  const { isUserOnline } = useOnlineStatus();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    document.title = t('chat.title') + ' - Caschi Gialli';
  }, [t]);

  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatInfo, setShowChatInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = activeChat ? messages[activeChat] || [] : [];
  const currentChat = chats.find(chat => chat.id === activeChat);

  // Filter chats based on search
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const otherParticipant = getOtherParticipant(chat).toLowerCase();
    return otherParticipant.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    sendMessage(activeChat, newMessage.trim());
    setNewMessage('');
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setShowMobileChat(true);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('chatId', chatId);
    navigate(`/chat?${newSearchParams.toString()}`, { replace: true });
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setActiveChat(null);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('chatId');
    const newUrl = newSearchParams.toString() ? `/chat?${newSearchParams.toString()}` : '/chat';
    navigate(newUrl, { replace: true });
  };

  const getOtherParticipant = (chat: any) => {
    if (!user) return 'Unknown';

    const currentUserId = user.id.toString();
    const customerIdStr = chat.customerId.toString();
    const cgIdStr = chat.cgId.toString();

    if (currentUserId === customerIdStr) {
      return chat.cgName;
    } else if (currentUserId === cgIdStr) {
      return chat.customerName;
    }

    return 'Unknown User';
  };

  const getOtherParticipantId = (chat: any) => {
    if (!user) return '';

    const currentUserId = user.id.toString();
    const customerIdStr = chat.customerId.toString();
    const cgIdStr = chat.cgId.toString();

    if (currentUserId === customerIdStr) {
      return cgIdStr;
    } else if (currentUserId === cgIdStr) {
      return customerIdStr;
    }

    return '';
  };

  const getOtherParticipantPhone = (chat: any) => {
    if (!user) return null;

    const currentUserId = user.id.toString();
    const customerIdStr = chat.customerId.toString();
    const cgIdStr = chat.cgId.toString();

    if (currentUserId === customerIdStr) {
      return chat.cgPhoneNumber || null;
    } else if (currentUserId === cgIdStr) {
      return chat.customerPhoneNumber || null;
    }

    return null;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('chat.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('chat.yesterday');
    } else {
      return date.toLocaleDateString();
    }
  };

  const getLastMessagePreview = (chat: any) => {
    if (!chat.lastMessage || !user) {
      return t('chat.noMessagesYet');
    }

    const currentUserId = user.id.toString();
    const messageSenderId = chat.lastMessage.senderId.toString();
    const isOwnMessage = messageSenderId === currentUserId;

    if (isOwnMessage) {
      return `${t('chat.you')}: ${chat.lastMessage.content}`;
    } else {
      return chat.lastMessage.content;
    }
  };

  const getMessageStatusIcon = (message: any) => {
    if (message.senderId !== user?.id.toString()) return null;

    if (message.read) {
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    } else if (message.delivered) {
      return <Check className="h-3 w-3 text-gray-500" />;
    } else {
      return <Check className="h-3 w-3 text-gray-300" />;
    }
  };

  const getLastMessageTime = (chat: any) => {
    if (!chat.lastMessage) return '';
    
    const messageDate = new Date(chat.lastMessage.timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return messageDate.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Messages</h2>
          <p className="text-gray-600 mb-6">{t('chat.loginRequired')}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
          >
            {t('chat.goToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Main Chat Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Sidebar Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{t('chat.title')}</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={refreshChats}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Refresh conversations"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="New conversation"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">{t('common.loading')}</p>
                </div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery ? 'No conversations found' : t('chat.noConversationsYet')}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? 'Try a different search term' : t('chat.noConversationsSubtitle')}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => navigate('/services')}
                      className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                    >
                      Find professionals to contact
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredChats.map(chat => {
                  const otherParticipantId = getOtherParticipantId(chat);
                  const isOnline = isUserOnline(otherParticipantId);
                  const lastMessageTime = getLastMessageTime(chat);
                  
                  return (
                    <button
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-all duration-200 relative ${
                        activeChat === chat.id ? 'bg-yellow-50 border-r-4 border-yellow-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          {/* Online Status */}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                            isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {getOtherParticipant(chat)}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {lastMessageTime && (
                                <span className="text-xs text-gray-500">{lastMessageTime}</span>
                              )}
                              {chat.unreadCount > 0 && (
                                <div className="w-5 h-5 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                  {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate pr-2">
                              {getLastMessagePreview(chat)}
                            </p>
                            {chat.lastMessage && chat.lastMessage.senderId === user.id.toString() && (
                              <div className="flex-shrink-0">
                                {getMessageStatusIcon(chat.lastMessage)}
                              </div>
                            )}
                          </div>

                          {/* Online Status Text */}
                          <div className="flex items-center mt-1">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            <span className={`text-xs ${
                              isOnline ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className={`flex-1 flex flex-col bg-gray-50 ${
          showMobileChat ? 'flex' : 'hidden md:flex'
        }`}>
          {activeChat && currentChat ? (
            <>
              {/* Chat Header */}
              <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Contact Avatar and Info */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                        isUserOnline(getOtherParticipantId(currentChat)) ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {getOtherParticipant(currentChat)}
                      </h3>
                      <p className={`text-sm ${
                        isUserOnline(getOtherParticipantId(currentChat)) ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {isUserOnline(getOtherParticipantId(currentChat)) ? 'Online now' : 'Offline'}
                      </p>
                    </div>
                  </div>

                  {/* Chat Actions */}
                  <div className="flex items-center space-x-2">
                    {getOtherParticipantPhone(currentChat) && (
                      <a
                        href={`tel:${getOtherParticipantPhone(currentChat)}`}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Call"
                      >
                        <Phone className="h-5 w-5" />
                      </a>
                    )}
                    <button
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Video call"
                    >
                      <Video className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowChatInfo(!showChatInfo)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      title="Chat info"
                    >
                      <Info className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
                {currentMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <MessageSquare className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Start your conversation
                      </h3>
                      <p className="text-gray-500 text-sm mb-6">
                        Send a message to {getOtherParticipant(currentChat)} to get started
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => setNewMessage('Hello! 👋')}
                          className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors border border-gray-200"
                        >
                          Hello! 👋
                        </button>
                        <button
                          onClick={() => setNewMessage('I need help with...')}
                          className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors border border-gray-200"
                        >
                          I need help with...
                        </button>
                        <button
                          onClick={() => setNewMessage('When are you available?')}
                          className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors border border-gray-200"
                        >
                          When are you available?
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {currentMessages.map((message, index) => {
                      const currentUserId = user.id.toString();
                      const messageSenderId = message.senderId.toString();
                      const isOwn = messageSenderId === currentUserId;

                      const showDate = index === 0 ||
                        formatDate(message.timestamp) !== formatDate(currentMessages[index - 1].timestamp);

                      const showAvatar = !isOwn && (
                        index === currentMessages.length - 1 ||
                        currentMessages[index + 1]?.senderId !== message.senderId
                      );

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="flex justify-center my-6">
                              <span className="bg-white text-gray-600 text-xs px-4 py-2 rounded-full shadow-sm border border-gray-200">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                          )}
                          
                          <div className={`flex items-end space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            {/* Avatar for received messages */}
                            {!isOwn && (
                              <div className={`w-8 h-8 rounded-full flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                                  <Users className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}

                            {/* Message Bubble */}
                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              isOwn
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-br-md'
                                : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              
                              {/* Message Footer */}
                              <div className={`flex items-center justify-between mt-2 ${
                                isOwn ? 'justify-end' : 'justify-start'
                              }`}>
                                <span className={`text-xs ${
                                  isOwn ? 'text-yellow-100' : 'text-gray-500'
                                }`}>
                                  {formatTime(message.timestamp)}
                                </span>
                                {isOwn && (
                                  <div className="ml-2 flex items-center">
                                    {getMessageStatusIcon(message)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Spacer for sent messages */}
                            {isOwn && <div className="w-8"></div>}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                  {/* Attachment Button */}
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    title="Attach file"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  {/* Message Input */}
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t('chat.typeMessage')}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none max-h-32 bg-gray-50 transition-all duration-200"
                      rows={1}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                      }}
                    />
                    
                    {/* Emoji Button */}
                    <button
                      type="button"
                      className="absolute right-3 bottom-3 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Add emoji"
                    >
                      <Smile className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center max-w-md mx-auto px-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <MessageSquare className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('chat.selectConversation')}
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {t('chat.selectConversationSubtitle')}
                </p>
                
                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/services')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                  >
                    Find Professionals
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 font-medium"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Info Sidebar (Desktop only) */}
        {showChatInfo && currentChat && (
          <div className="hidden lg:block w-80 bg-white border-l border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Contact Info</h3>
                <button
                  onClick={() => setShowChatInfo(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Profile */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {getOtherParticipant(currentChat)}
                </h4>
                <p className={`text-sm ${
                  isUserOnline(getOtherParticipantId(currentChat)) ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {isUserOnline(getOtherParticipantId(currentChat)) ? 'Online now' : 'Last seen recently'}
                </p>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                {getOtherParticipantPhone(currentChat) && (
                  <a
                    href={`tel:${getOtherParticipantPhone(currentChat)}`}
                    className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <Phone className="h-5 w-5 mr-3 text-green-500" />
                    <div className="text-left">
                      <p className="font-medium">Call</p>
                      <p className="text-sm text-gray-500">{getOtherParticipantPhone(currentChat)}</p>
                    </div>
                  </a>
                )}
                
                <button
                  onClick={() => navigate(`/profile/${getOtherParticipantId(currentChat)}`)}
                  className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <Users className="h-5 w-5 mr-3 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">View Profile</p>
                    <p className="text-sm text-gray-500">See professional details</p>
                  </div>
                </button>
              </div>

              {/* Chat Settings */}
              <div className="border-t border-gray-200 pt-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Chat Settings</h5>
                <div className="space-y-2">
                  <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200">
                    <Bell className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="text-sm">Mute notifications</span>
                  </button>
                  <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200">
                    <Star className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="text-sm">Star conversation</span>
                  </button>
                  <button className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                    <Trash2 className="h-4 w-4 mr-3" />
                    <span className="text-sm">Delete conversation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;