import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useOnlineStatus } from '../contexts/OnlineStatusContext';
import OnlineStatusIndicator from '../components/OnlineStatusIndicator';
import { MessageSquare, Send, ArrowLeft, Users, Phone, RefreshCw } from 'lucide-react';

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

  // Set page title for SEO
  React.useEffect(() => {
    document.title = 'Messaggi - Chat con Professionisti | Caschi Gialli';
  }, []);

  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = activeChat ? messages[activeChat] || [] : [];
  const currentChat = chats.find(chat => chat.id === activeChat);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest('.overflow-y-auto');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
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
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setActiveChat(null);
  };

  const getOtherParticipant = (chat: any) => {
    if (!user) return 'Unknown';

    // Convert IDs to strings for consistent comparison
    const currentUserId = user.id.toString();
    const customerIdStr = chat.customerId.toString();
    const cgIdStr = chat.cgId.toString();

    if (currentUserId === customerIdStr) {
      // Current user is customer, show CG name
      return chat.cgName;
    } else if (currentUserId === cgIdStr) {
      // Current user is CG, show customer name
      return chat.customerName;
    }

    // Fallback
    return 'Unknown User';
  };

  // Get phone number from chat data (from API response)
  const getOtherParticipantPhone = (chat: any) => {
    if (!user) return null;

    // Convert IDs to strings for consistent comparison
    const currentUserId = user.id.toString();
    const customerIdStr = chat.customerId.toString();
    const cgIdStr = chat.cgId.toString();

    if (currentUserId === customerIdStr) {
      // Current user is customer, return CG phone number
      return chat.cgPhoneNumber || null;
    } else if (currentUserId === cgIdStr) {
      // Current user is CG, return customer phone number
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

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">{t('chat.loginRequired')}</p>
            <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {t('chat.goToLogin')}
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="h-screen bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with refresh button */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{t('chat.title')}</h1>
            <button
                onClick={refreshChats}
                disabled={loading}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('chat.refresh')}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-10rem)] overflow-hidden">
            <div className="flex h-full">
              {/* Chat List - Hidden on mobile when chat is active */}
              <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${
                  showMobileChat ? 'hidden md:flex' : 'flex'
              }`}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{t('chat.conversations')}</h2>
                    <div className="flex items-center space-x-2">
                      {chats.length > 0 && (
                          <span className="text-sm text-gray-500">
                        {t('chat.conversations', { count: chats.length })}
                      </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                      <div className="p-6">
                        <div className="text-center py-12">
                          <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
                          <p className="text-gray-500">{t('common.loading')}</p>
                        </div>
                      </div>
                  ) : chats.length === 0 ? (
                      <div className="p-6">
                        <div className="text-center py-12">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">{t('chat.noConversationsYet')}</p>
                          <p className="text-gray-400 text-sm mt-2">
                            {t('chat.noConversationsSubtitle')}
                          </p>
                        </div>
                      </div>
                  ) : (
                      <div className="divide-y divide-gray-100">
                        {chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => handleChatSelect(chat.id)}
                                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                                    activeChat === chat.id ? 'bg-yellow-50 border-r-2 border-yellow-500' : ''
                                }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden">
                                  {/* Try to get profile image for the other participant */}
                                  <Users className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {getOtherParticipant(chat)}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      {/* Online Status */}
                                      <OnlineStatusIndicator 
                                        userId={user.id.toString() === chat.customerId.toString() ? chat.cgId : chat.customerId}
                                        size="sm"
                                      />
                                    {chat.lastMessage && (
                                        <p className="text-xs text-gray-500">
                                          {formatTime(chat.lastMessage.timestamp)}
                                        </p>
                                    )}
                                  </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 truncate">
                                      {getLastMessagePreview(chat)}
                                    </p>
                                    {chat.unreadCount > 0 && (
                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-yellow-500 rounded-full">
                                  {chat.unreadCount}
                                </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                        ))}
                      </div>
                  )}
                </div>
              </div>

              {/* Chat Area - Full width on mobile when active */}
              <div className={`flex-1 flex flex-col ${
                  showMobileChat ? 'flex' : 'hidden md:flex'
              }`}>
                {activeChat && currentChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                                onClick={handleBackToList}
                                className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center overflow-hidden">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {getOtherParticipant(currentChat)}
                              </h3>
                              <OnlineStatusIndicator 
                                userId={user.id.toString() === currentChat.customerId.toString() ? currentChat.cgId : currentChat.customerId}
                                size="sm"
                                showText={true}
                              />
                            </div>
                          </div>

                          {/* Contact Info - Only show if phone number is available */}
                          {getOtherParticipantPhone(currentChat) && (
                              <div className="flex items-center">
                                <a
                                    href={`tel:${getOtherParticipantPhone(currentChat)}`}
                                    className="flex items-center text-sm text-gray-600 hover:text-yellow-600 transition-colors px-3 py-2 rounded-lg hover:bg-yellow-50"
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  <span>{getOtherParticipantPhone(currentChat)}</span>
                                </a>
                              </div>
                          )}
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
                        {currentMessages.length === 0 ? (
                            <div className="text-center py-8">
                              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500">{t('chat.noMessagesYet')}</p>
                              <p className="text-gray-400 text-sm">{t('chat.startConversation')}</p>
                            </div>
                        ) : (
                            <>
                              {currentMessages.map((message, index) => {
                                // Convert IDs to strings for consistent comparison
                                const currentUserId = user.id.toString();
                                const messageSenderId = message.senderId.toString();
                                const isOwn = messageSenderId === currentUserId;

                                const showDate = index === 0 ||
                                    formatDate(message.timestamp) !== formatDate(currentMessages[index - 1].timestamp);

                                return (
                                    <div key={message.id}>
                                      {showDate && (
                                          <div className="text-center my-4">
                                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                    {formatDate(message.timestamp)}
                                  </span>
                                          </div>
                                      )}
                                      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            isOwn
                                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                        }`}>
                                          <p className="text-sm">{message.content}</p>
                                          <p className={`text-xs mt-1 ${
                                              isOwn ? 'text-yellow-100' : 'text-gray-500'
                                          }`}>
                                            {formatTime(message.timestamp)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                );
                              })}
                              <div ref={messagesEndRef} style={{ height: '1px' }} />
                            </>
                        )}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                          <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder={t('chat.typeMessage')}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage(e);
                                }
                              }}
                          />
                          <button
                              type="submit"
                              disabled={!newMessage.trim()}
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <Send className="h-5 w-5" />
                          </button>
                        </form>
                      </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">{t('chat.selectConversation')}</p>
                        <p className="text-gray-400 text-sm mt-2">
                          {t('chat.selectConversationSubtitle')}
                        </p>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Chat;