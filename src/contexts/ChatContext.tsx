import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
}

interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: string | null;
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, senderId: string, senderName: string, type?: 'text' | 'image') => void;
  createChat: (participantIds: string[], participantNames: string[]) => string;
  markAsRead: (chatId: string) => void;
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const createChat = (participantIds: string[], participantNames: string[]): string => {
    const existingChat = chats.find(chat =>
      chat.participants.length === participantIds.length &&
      participantIds.every(id => chat.participants.includes(id))
    );

    if (existingChat) {
      return existingChat.id;
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      participants: participantIds,
      participantNames: participantNames,
      messages: [],
      unreadCount: 0
    };

    setChats(prev => [...prev, newChat]);
    return newChat.id;
  };

  const sendMessage = (
    chatId: string,
    content: string,
    senderId: string,
    senderName: string,
    type: 'text' | 'image' = 'text'
  ) => {
    const message: Message = {
      id: Date.now().toString(),
      senderId,
      senderName,
      content,
      timestamp: new Date(),
      type
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              lastMessage: message,
              unreadCount: activeChat === chatId ? 0 : chat.unreadCount + 1
            }
          : chat
      )
    );
  };

  const markAsRead = (chatId: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      setActiveChat,
      sendMessage,
      createChat,
      markAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};