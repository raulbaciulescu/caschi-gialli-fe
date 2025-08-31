import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {ChatMessage, ChatRoom, websocketService} from '../services/websocket.service';
import {chatService, MessageDto} from '../services/chat.service';
import {useAuth} from './AuthContext';
import {useNotifications} from "./NotificationContext.tsx";
import {t} from "i18next";

interface ChatContextType {
    chats: ChatRoom[];
    activeChat: string | null;
    messages: Record<string, ChatMessage[]>;
    setActiveChat: (chatId: string | null) => void;
    sendMessage: (chatId: string, content: string, type?: 'text' | 'image') => void;
    createChat: (participantIds: string[], participantNames: string[]) => Promise<string>;
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

export const ChatProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const {user, isAuthenticated} = useAuth();
    const [chats, setChats] = useState<ChatRoom[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const {addNotification} = useNotifications();

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
            await connectWebSocket();
            await loadChatsFromAPI();
        } catch (error) {
            console.error('Failed to initialize chat:', error);
            setIsConnected(false);
            await loadChatsFromAPI();
        }
    };

    const connectWebSocket = async () => {
        if (!user) return;

        try {
            await websocketService.connect(user.id.toString());
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

            const transformedChats: ChatRoom[] = chatsData.map(chat => {
                const customerIdStr = chat.customerId.toString();
                const cgIdStr = chat.cgId.toString();

                return {
                    id: chat.id.toString(),
                    customerId: customerIdStr,
                    customerName: chat.customerName,
                    customerPhoneNumber: chat.customerPhoneNumber,
                    cgId: cgIdStr,
                    cgName: chat.cgName,
                    cgPhoneNumber: chat.cgPhoneNumber,
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

            const transformedMessages: ChatMessage[] = messagesData.map(msg => {
                return transformMessageDto(msg, chatId);
            });

            setMessages(prev => ({
                ...prev,
                [chatId]: transformedMessages
            }));

            if (transformedMessages.length > 0 && user) {
                transformedMessages.forEach(message => {
                    if (message.senderId !== user.id.toString() && !message.read) {
                        websocketService.acknowledgeMessage(message.id, user.id.toString());
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const transformMessageDto = (dto: MessageDto, chatId: string): ChatMessage => {
        return {
            id: String(dto.id),
            chatId,
            senderId: String(dto.senderId),
            content: dto.content ?? '',
            timestamp: new Date(dto.timestamp),
            type: 'text',
            read: Boolean(dto.read)
        };
    };

    const handleNotifications = (data) => {
        if (!user) return;

        const messageSenderId = data.senderId?.toString();
        const currentUserId = user.id.toString();

        if (messageSenderId !== currentUserId) {
            addNotification({
                type: 'message',
                title: t('notifications.newMessage2'),
                message: data.content,
                chatId: String(data.chatId),
                senderId: messageSenderId,
                senderName: data.senderName,
                avatar: data.senderAvatar,
                data
            });
        }
    }

    const setupMessageHandlers = () => {
        // Handle incoming chat messages
        websocketService.onMessage('chat_message', (data: any) => {
            handleNotifications(data);
            const message: ChatMessage = {
                id: data.id.toString(),
                chatId: data.chatId,
                senderId: data.senderId.toString(),
                content: data.content,
                timestamp: new Date(data.timestamp),
                type: data.type || 'text',
                delivered: false,
                read: false
            };
            console.log("receiving message")

            setMessages(prev => ({
                ...prev,
                [data.chatId]: [...(prev[data.chatId] || []), message]
            }));

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

        websocketService.onMessage('message_read', (data: any) => {
          const { chatId, readerId, upToMessageId, readAt } = data;

          setMessages(prev => {
            const updatedMessages = prev[chatId].map(message => {
              const shouldMarkAsRead = upToMessageId
                ? parseInt(message.id) <= parseInt(upToMessageId)
                : true;

              return shouldMarkAsRead && message.senderId === user?.id.toString()
                ? {
                    ...message,
                    read: true,
                    readAt: new Date(readAt)
                  }
                : message;
            });

            return {
              ...prev,
              [chatId]: updatedMessages
            };
          });

          console.log(`Messages in chat ${chatId} read by ${readerId} up to ${upToMessageId || 'latest'} at ${readAt}`);
        });

        // Handle unread count updates
        // websocketService.onMessage('unread_count', (data: any) => {
        //   const { chatId, count } = data;
        //
        //   setChats(prev =>
        //     prev.map(chat =>
        //       chat.id === chatId
        //         ? { ...chat, unreadCount: count }
        //         : chat
        //     )
        //   );
        //
        //   console.log(`Unread count for chat ${chatId}: ${count}`);
        // });

        // Handle chat creation
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

            setActiveChat(data.id.toString());
        });
    };

    const createChat = async (participantIds: string[], participantNames: string[]): Promise<string> => {
        if (!user) throw new Error('User not authenticated');

        const userIdStr = user.id.toString();
        const existingChat = chats.find(chat => {
            const customerIdStr = chat.customerId.toString();
            const cgIdStr = chat.cgId.toString();

            return (customerIdStr === userIdStr && participantIds.includes(cgIdStr)) ||
                (cgIdStr === userIdStr && participantIds.includes(customerIdStr));
        });

        if (existingChat) {
            setActiveChat(existingChat.id);
            return existingChat.id;
        }

        if (isConnected) {
            let customerId: string, cgId: string;

            if (user.type === 'client' || user.type === 'customer') {
                customerId = user.id.toString();
                cgId = participantIds.find(id => id !== user.id.toString()) || participantIds[1];
            } else {
                cgId = user.id.toString();
                customerId = participantIds.find(id => id !== cgId) || participantIds[0];
            }

            websocketService.createChat(customerId, cgId);

            const tempId = `temp-${Date.now()}`;
            return tempId;
        } else {
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
            setMessages(prev => ({...prev, [newChat.id]: []}));

            setActiveChat(newChat.id);

            return newChat.id;
        }
    };

    const sendMessage = (chatId: string, content: string, type: 'text' | 'image' = 'text') => {
        if (!user) return;

        if (isConnected) {
            websocketService.sendMessage(chatId, content, type);
        } else {
            const message: ChatMessage = {
                id: Date.now().toString(),
                chatId,
                senderId: user.id.toString(),
                content,
                timestamp: new Date(),
                type,
                delivered: false,
                read: false
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
                            unreadCount: chat.unreadCount
                        }
                        : chat
                )
            );
        }
    };

    const handleSetActiveChat = async (chatId: string | null) => {
        setActiveChat(chatId);

        if (chatId) {
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
            isConnected,
            loading,
            loadChatHistory,
            refreshChats
        }}>
            {children}
        </ChatContext.Provider>
    );
};