import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { websocketService, ChatMessage, ChatRoom } from '../services/websocket.service';
import { chatService, MessageDto, ChatDto } from '../services/chat.service';
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
  loading: boolean;
  loadChatHistory: (chatId: string) => Promise<void>;
  refreshChats: () => Promise<void>;
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
  const [loading, setLoading] = useState(false);

  // Initialize WebSocket connection and load chats when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeChat();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated, user]);

  const initializeChat = async () => {
    if (!user) return;

    try {
      // Connect to WebSocket
      await connectWebSocket();

      // Load existing chats from REST API
      await loadChatsFromAPI();
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setIsConnected(false);
      // Still try to load chats even if WebSocket fails
      await loadChatsFromAPI();
    }
  };

  const connectWebSocket = async () => {
    if (!user) return;

    try {
      await websocketService.connect(user.id);
      setIsConnected(true);
      setupMessageHandlers();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
    }
  };

  const disconnectWebSocket = () => {
    websocketService.disconnect();
    setIsConnected(false);
  };

  const loadChatsFromAPI = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const chatsData = await chatService.getUserChats();

      // Transform backend chat data to frontend format
      const transformedChats: ChatRoom[] = chatsData.map(chat => {
        // Convert IDs to strings for consistent comparison
        const customerIdStr = chat.customerId.toString();
        const cgIdStr = chat.cgId.toString();

        return {
          id: chat.id.toString(),
          // Store both customer and CG info for easy access
          customerId: customerIdStr,
          customerName: chat.customerName,
          customerPhoneNumber: chat.customerPhoneNumber, // Add phone number
          cgId: cgIdStr,
          cgName: chat.cgName,
          cgPhoneNumber: chat.cgPhoneNumber, // Add phone number
          // Keep participants array for compatibility
          participants: [customerIdStr, cgIdStr],
          participantNames: [chat.customerName, chat.cgName],
          lastMessage: chat.lastMessage ? transformMessageDto(chat.lastMessage, chat.id.toString()) : undefined,
          unreadCount: chat.unreadCount || 0,
          createdAt: new Date(chat.createdAt)
        };
      });

      setChats(transformedChats);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async (chatId: string) => {
    try {
      const messagesData = await chatService.getChatMessages(chatId);

      // Transform backend message data to frontend format
      const transformedMessages: ChatMessage[] = messagesData.map(msg => {
        return transformMessageDto(msg, chatId);
      });

      setMessages(prev => ({
        ...prev,
        [chatId]: transformedMessages
      }));
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const transformMessageDto = (dto: MessageDto, chatId: string): ChatMessage => {
    return {
      id: dto.id.toString(),
      chatId: chatId,
      senderId: dto.senderId.toString(), // Ensure senderId is string
      content: dto.content,
      timestamp: new Date(dto.timestamp),
      type: (dto.type as 'text' | 'image') || 'text'
    };
  };

  const setupMessageHandlers = () => {
    // Handle incoming chat messages
    websocketService.onMessage('chat_message', (data: any) => {
      const message: ChatMessage = {
        id: data.id.toString(),
        chatId: data.chatId,
        senderId: data.senderId.toString(), // Ensure senderId is string
        content: data.content,
        timestamp: new Date(data.timestamp),
        type: data.type || 'text'
      };

      setMessages(prev => ({
        ...prev,
        [data.chatId]: [...(prev[data.chatId] || []), message]
      }));

      // Update chat's last message and unread count
      // Only increment unread count if:
      // 1. The message is NOT from the current user
      // 2. The chat is NOT currently active
      const isOwnMessage = user && data.senderId.toString() === user.id.toString();
      const shouldIncrementUnread = !isOwnMessage && activeChat !== data.chatId;

      setChats(prev =>
          prev.map(chat =>
              chat.id === data.chatId
                  ? {
                    ...chat,
                    lastMessage: message,
                    unreadCount: shouldIncrementUnread ? chat.unreadCount + 1 : chat.unreadCount
                  }
                  : chat
          )
      );
    });

    // Handle chat creation - backend format
    websocketService.onMessage('chat_created', (data: any) => {
      const newChat: ChatRoom = {
        id: data.id.toString(),
        customerId: data.customerId.toString(),
        customerName: data.customerName,
        customerPhoneNumber: data.customerPhoneNumber,
        cgId: data.cgId.toString(),
        cgName: data.cgName,
        cgPhoneNumber: data.cgPhoneNumber,
        participants: [data.customerId.toString(), data.cgId.toString()],
        participantNames: [data.customerName, data.cgName],
        unreadCount: data.unreadCount || 0,
        createdAt: new Date(data.createdAt)
      };

      setChats(prev => {
        const exists = prev.find(chat => chat.id === data.id.toString());
        if (exists) return prev;
        return [...prev, newChat];
      });

      // Set as active chat when created
      setActiveChat(data.id.toString());
    });
  };

  const createChat = async (participantIds: string[], participantNames: string[]): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    // Check if chat already exists
    const userIdStr = user.id.toString();
    const existingChat = chats.find(chat => {
      const customerIdStr = chat.customerId.toString();
      const cgIdStr = chat.cgId.toString();

      return (customerIdStr === userIdStr && participantIds.includes(cgIdStr)) ||
          (cgIdStr === userIdStr && participantIds.includes(customerIdStr));
    });

    if (existingChat) {
      // Set this chat as active when creating/finding it
      setActiveChat(existingChat.id);
      return existingChat.id;
    }

    if (isConnected) {
      // Determine who is customer and who is CG based on user type
      let customerId: string, cgId: string;

      if (user.type === 'client' || user.type === 'customer') {
        customerId = user.id.toString();
        cgId = participantIds.find(id => id !== user.id) || participantIds[1];
      } else {
        cgId = user.id.toString();
        customerId = participantIds.find(id => id !== user.id) || participantIds[0];
      }

      // Use WebSocket to create chat with backend format
      websocketService.createChat(customerId, cgId);

      // Return a temporary ID - the real ID will come from the server
      const tempId = `temp-${Date.now()}`;
      return tempId;
    } else {
      // Fallback to local chat creation
      const newChat: ChatRoom = {
        id: Date.now().toString(),
        customerId: user.type === 'client' || user.type === 'customer' ? user.id.toString() : participantIds[0],
        customerName: user.type === 'client' || user.type === 'customer' ? user.name : participantNames[0],
        cgId: user.type === 'cg' ? user.id.toString() : participantIds[1],
        cgName: user.type === 'cg' ? user.name : participantNames[1],
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
      // Send via WebSocket - the message handler will update the UI
      websocketService.sendMessage(chatId, content, type);
    } else {
      // Fallback to local message handling
      const message: ChatMessage = {
        id: Date.now().toString(),
        chatId,
        senderId: user.id.toString(),
        content,
        timestamp: new Date(),
        type
      };

      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message]
      }));

      // For local messages, update last message but don't change unread count
      // since it's your own message
      setChats(prev =>
          prev.map(chat =>
              chat.id === chatId
                  ? {
                    ...chat,
                    lastMessage: message,
                    // Don't change unread count for own messages
                    unreadCount: chat.unreadCount
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

  const handleSetActiveChat = async (chatId: string | null) => {
    setActiveChat(chatId);

    if (chatId) {
      markAsRead(chatId);
      // Load chat history when switching to a chat
      await loadChatHistory(chatId);
    }
  };

  const refreshChats = async () => {
    await loadChatsFromAPI();
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
        isConnected,
        loading,
        loadChatHistory,
        refreshChats
      }}>
        {children}
      </ChatContext.Provider>
  );
};