import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';

export interface MessageDto {
    id: number;
    senderId: string;
    content: string;
    type: string;
    timestamp: string; // ISO string from backend
}

export interface ChatDto {
    id: number;
    customerId: number;
    customerName: string;
    customerPhoneNumber?: string; // Phone number for customer
    cgId: number;
    cgName: string;
    cgPhoneNumber?: string; // Phone number for CG
    createdAt: string; // ISO string from backend
    lastMessage?: MessageDto;
    unreadCount?: number;
}

class ChatService {
    /**
     * Get all chats for the current user
     */
    public async getUserChats(): Promise<ChatDto[]> {
        try {
            const response = await httpService.get<ChatDto[]>(API_ENDPOINTS.CHAT.LIST);
            return response;
        } catch (error) {
            console.error('Failed to get user chats:', error);
            throw new Error('Failed to get user chats');
        }
    }

    /**
     * Get messages for a specific chat
     */
    public async getChatMessages(chatId: string): Promise<MessageDto[]> {
        try {
            const endpoint = API_ENDPOINTS.CHAT.MESSAGES.replace('{chatId}', chatId);
            const response = await httpService.get<MessageDto[]>(endpoint);
            return response;
        } catch (error) {
            console.error('Failed to get chat messages:', error);
            throw new Error('Failed to get chat messages');
        }
    }
}

export const chatService = new ChatService();