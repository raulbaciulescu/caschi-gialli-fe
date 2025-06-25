import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { websocketService, ChatMessage, ChatRoom } from '../services/websocket.service';
import { useAuth } from './AuthContext';

interface ChatContextType {
  chats: ChatRoom[];
  activeChat: string | null;
  messages: Record<string, ChatMessage[]>;
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, type?: 'text' | 'image') => void;
  createChat: (participantIds: string[], participantNames: string[]) => Promise<string>;
  markAsRead: (chatId: string) => void;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated, user]);

  const connectWebSocket = async () => {
    if (!user) return;

    try {
      await websocketService.connect(user.id);
      setIsConnected(true);
      setupMessageHandlers();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
      // Fallback to mock mode
      setupMockMode();
    }
  };

  const disconnectWebSocket = () => {
    websocketService.disconnect();
    setIsConnected(false);
  };

  const setupMessageHandlers = () => {
    // Handle incoming chat messages
    websocketService.onMessage('chat_message', (data: any) => {
      const message: ChatMessage = {
        id: data.id || Date.now().toString(),
        chatId: data.chatId,
        senderId: data.senderId,
        senderName: data.senderName,
        content: data.content,
        timestamp: new Date(data.timestamp),
        type: data.messageType || 'text'
      };

      setMessages(prev => ({
        ...prev,
        [data.chatId]: [...(prev[data.chatId] || []), message]
      }));

      // Update chat's last message and unread count
      setChats(prev =>
        prev.map(chat =>
          chat.id === data.chatId
            ? {
                ...chat,
                lastMessage: message,
                unreadCount: activeChat === data.chatId ? 0 : chat.unreadCount + 1
              }
            : chat
        )
      );
    });

    // Handle chat creation
    websocketService.onMessage('chat_created', (data: any) => {
      const newChat: ChatRoom = {
        id: data.chatId,
        participants: data.participants,
        participantNames: data.participantNames,
        unreadCount: 0,
        createdAt: new Date(data.createdAt)
      };

      setChats(prev => {
        const exists = prev.find(chat => chat.id === data.chatId);
        if (exists) return prev;
        return [...prev, newChat];
      });
    });

    // Handle chat list updates
    websocketService.onMessage('chat_list', (data: any) => {
      setChats(data.chats || []);
    });

    // Handle chat history
    websocketService.onMessage('chat_history', (data: any) => {
      setMessages(prev => ({
        ...prev,
        [data.chatId]: data.messages || []
      }));
    });
  };

  const setupMockMode = () => {
    console.log('Setting up mock chat mode');
    setIsConnected(false);
  };

  const createChat = async (participantIds: string[], participantNames: string[]): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    // Check if chat already exists
    const existingChat = chats.find(chat =>
      chat.participants.length === participantIds.length &&
      participantIds.every(id => chat.participants.includes(id))
    );

    if (existingChat) {
      // Set this chat as active when creating/finding it
      setActiveChat(existingChat.id);
      return existingChat.id;
    }

    if (isConnected) {
      // Use WebSocket to create chat
      websocketService.createChat(participantIds, participantNames);
      
      // Return a temporary ID - the real ID will come from the server
      const tempId = `temp-${Date.now()}`;
      setActiveChat(tempId);
      return tempId;
    } else {
      // Fallback to local chat creation
      const newChat: ChatRoom = {
        id: Date.now().toString(),
        participants: participantIds,
        participantNames: participantNames,
        unreadCount: 0,
        createdAt: new Date()
      };

      setChats(prev => [...prev, newChat]);
      setMessages(prev => ({ ...prev, [newChat.id]: [] }));
      
      // Set this chat as active
      setActiveChat(newChat.id);
      
      return newChat.id;
    }
  };

  const sendMessage = (chatId: string, content: string, type: 'text' | 'image' = 'text') => {
    if (!user) return;

    if (isConnected) {
      websocketService.sendMessage(chatId, content, type);
    } else {
      // Fallback to local message handling
      const message: ChatMessage = {
        id: Date.now().toString(),
        chatId,
        senderId: user.id,
        senderName: user.name,
        content,
        timestamp: new Date(),
        type
      };

      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message]
      }));

      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: message,
                unreadCount: activeChat === chatId ? 0 : chat.unreadCount + 1
              }
            : chat
        )
      );
    }
  };

  const markAsRead = (chatId: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };

  const handleSetActiveChat = (chatId: string | null) => {
    if (activeChat && isConnected) {
      websocketService.leaveChat(activeChat);
    }

    setActiveChat(chatId);

    if (chatId) {
      markAsRead(chatId);
      if (isConnected) {
        websocketService.joinChat(chatId);
      }
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      messages,
      setActiveChat: handleSetActiveChat,
      sendMessage,
      createChat,
      markAsRead,
      isConnected
    }}>
      {children}
    </ChatContext.Provider>
  );
};