import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { MessageSquare, Send, ArrowLeft, Users, Wifi, WifiOff, Phone, RefreshCw } from 'lucide-react';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const {
    chats,
    activeChat,
    messages,
    setActiveChat,
    sendMessage,
    isConnected,
    loading,
    refreshChats
  } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = activeChat ? messages[activeChat] || [] : [];
  const currentChat = chats.find(chat => chat.id === activeChat);

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

    console.log(`getOtherParticipant: currentUserId=${currentUserId}, customerIdStr=${customerIdStr}, cgIdStr=${cgIdStr}`);
    console.log(`customerName=${chat.customerName}, cgName=${chat.cgName}`);

    if (currentUserId === customerIdStr) {
      // Utilizatorul curent este customer, afișează numele CG-ului
      console.log('User is customer, showing CG name:', chat.cgName);
      return chat.cgName;
    } else if (currentUserId === cgIdStr) {
      // Utilizatorul curent este CG, afișează numele customer-ului
      console.log('User is CG, showing customer name:', chat.customerName);
      return chat.customerName;
    }

    // Fallback - nu ar trebui să ajungă aici
    console.log('No match found, returning Unknown User');
    return 'Unknown User';
  };

  // Mock function to get phone number - in real app this would come from user data
  const getOtherParticipantPhone = (chat: any) => {
    // This would normally come from the backend user data
    return '+39 333 123 4567'; // Mock phone number
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
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Please log in to access messages.</p>
            <a
                href="/login"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Go to Login
            </a>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Connection Status */}
          <div className="mb-4 flex items-center justify-between">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isConnected
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 mr-2" />
                    Connected
                  </>
              ) : (
                  <>
                    <WifiOff className="h-4 w-4 mr-2" />
                    Offline Mode
                  </>
              )}
            </div>

            <button
                onClick={refreshChats}
                disabled={loading}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Debug Info */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info:</h3>
            <p className="text-xs text-blue-700">Current User ID: {user.id} (type: {typeof user.id})</p>
            <p className="text-xs text-blue-700">Current User Type: {user.type}</p>
            <p className="text-xs text-blue-700">Current User Name: {user.name}</p>
            <p className="text-xs text-blue-700">Total Chats: {chats.length}</p>
            {currentChat && (
                <>
                  <p className="text-xs text-blue-700">Active Chat ID: {currentChat.id}</p>
                  <p className="text-xs text-blue-700">Customer ID: {currentChat.customerId} (name: {currentChat.customerName})</p>
                  <p className="text-xs text-blue-700">CG ID: {currentChat.cgId} (name: {currentChat.cgName})</p>
                  <p className="text-xs text-blue-700">Other Participant: {getOtherParticipant(currentChat)}</p>
                </>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-12rem)] overflow-hidden">
            <div className="flex h-full">
              {/* Chat List - Hidden on mobile when chat is active */}
              <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${
                  showMobileChat ? 'hidden md:flex' : 'flex'
              }`}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                    <div className="flex items-center space-x-2">
                      {chats.length > 0 && (
                          <span className="text-sm text-gray-500">
                        {chats.length} conversation{chats.length !== 1 ? 's' : ''}
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
                          <p className="text-gray-500">Loading conversations...</p>
                        </div>
                      </div>
                  ) : chats.length === 0 ? (
                      <div className="p-6">
                        <div className="text-center py-12">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No conversations yet</p>
                          <p className="text-gray-400 text-sm mt-2">
                            Start by contacting a service provider or client
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
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                                  <Users className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {getOtherParticipant(chat)}
                                    </p>
                                    {chat.lastMessage && (
                                        <p className="text-xs text-gray-500">
                                          {formatTime(chat.lastMessage.timestamp)}
                                        </p>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 truncate">
                                      {chat.lastMessage?.content || 'No messages yet'}
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
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {getOtherParticipant(currentChat)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {isConnected ? 'Online' : 'Offline'}
                              </p>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="flex items-center">
                            <a
                                href={`tel:${getOtherParticipantPhone(currentChat)}`}
                                className="flex items-center text-sm text-gray-600 hover:text-yellow-600 transition-colors px-3 py-2 rounded-lg hover:bg-yellow-50"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{getOtherParticipantPhone(currentChat)}</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {currentMessages.length === 0 ? (
                            <div className="text-center py-8">
                              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500">No messages yet</p>
                              <p className="text-gray-400 text-sm">Start the conversation!</p>
                            </div>
                        ) : (
                            <>
                              {currentMessages.map((message, index) => {
                                // Convert IDs to strings for consistent comparison
                                const currentUserId = user.id.toString();
                                const messageSenderId = message.senderId.toString();
                                const isOwn = messageSenderId === currentUserId;

                                console.log(`Message ${message.id}: senderId=${messageSenderId}, currentUserId=${currentUserId}, isOwn=${isOwn}`);

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
                                          {/* Debug info for each message */}
                                          <p className={`text-xs mt-1 ${
                                              isOwn ? 'text-yellow-200' : 'text-gray-400'
                                          }`}>
                                            ID: {messageSenderId} | Own: {isOwn ? 'Yes' : 'No'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                );
                              })}
                              <div ref={messagesEndRef} />
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
                              placeholder="Type a message..."
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                        <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Choose from your existing conversations or start a new one
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