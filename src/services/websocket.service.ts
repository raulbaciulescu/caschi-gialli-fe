import { API_CONFIG } from '../config/api';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName?: string; // Optional since backend doesn't store this
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
}

export interface ChatRoom {
  id: string;
  // Backend specific fields
  customerId: string;
  customerName: string;
  customerPhoneNumber?: string; // Phone number for customer
  cgId: string;
  cgName: string;
  cgPhoneNumber?: string; // Phone number for CG
  // Legacy compatibility fields
  participants: string[];
  participantNames: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
}

interface ChatPayload {
  type: string;
  data: any;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isConnected = false;
  private userId: string | null = null;

  public connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userId = userId;

      // Construct WebSocket URL to match backend endpoint
      let wsUrl: string;
      if (import.meta.env.VITE_WS_URL) {
        wsUrl = `${import.meta.env.VITE_WS_URL}?userId=${userId}`;
      } else {
        // Convert HTTP/HTTPS base URL to WebSocket URL
        const baseUrl = API_CONFIG.BASE_URL;
        const wsBaseUrl = baseUrl.replace(/^https?:\/\//, (match) => {
          return match === 'https://' ? 'wss://' : 'ws://';
        });
        wsUrl = `${wsBaseUrl}/ws?userId=${userId}`;
      }

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const payload: ChatPayload = JSON.parse(event.data);
            this.handleMessage(payload);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.messageHandlers.clear();
  }

  public sendMessage(chatId: string, content: string, type: 'text' | 'image' = 'text'): void {
    if (!this.isConnected || !this.ws || !this.userId) {
      console.error('WebSocket not connected');
      return;
    }

    const payload: ChatPayload = {
      type: 'chat_message',
      data: {
        chatId,
        senderId: this.userId,
        content,
        messageType: type
      }
    };

    this.ws.send(JSON.stringify(payload));
  }

  public createChat(customerId: string, cgId: string): void {
    if (!this.isConnected || !this.ws) {
      console.error('WebSocket not connected');
      return;
    }

    const payload: ChatPayload = {
      type: 'create_chat',
      data: {
        customerId,
        cgId
      }
    };

    this.ws.send(JSON.stringify(payload));
  }

  public onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  public offMessage(type: string): void {
    this.messageHandlers.delete(type);
  }

  private handleMessage(payload: ChatPayload): void {
    const { type, data } = payload;

    // Handle different message types from backend
    switch (type) {
      case 'chat_created':
        this.handleChatCreated(data);
        break;
      case 'chat_message':
        this.handleChatMessage(data);
        break;
      default:
        console.log('Unhandled WebSocket message type:', type);
    }
  }

  private handleChatCreated(data: any): void {
    const handler = this.messageHandlers.get('chat_created');
    if (handler) {
      // Transform backend data to frontend format
      const chatData = {
        id: data.id,
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhoneNumber: data.customerPhoneNumber,
        cgId: data.cgId,
        cgName: data.cgName,
        cgPhoneNumber: data.cgPhoneNumber,
        createdAt: data.createdAt,
        unreadCount: data.unreadCount || 0
      };
      handler(chatData);
    }
  }

  private handleChatMessage(data: any): void {
    const handler = this.messageHandlers.get('chat_message');
    if (handler) {
      // Backend sends message data directly
      handler(data);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId).catch(console.error);
      }
    }, delay);
  }

  public get connected(): boolean {
    return this.isConnected;
  }
}

export const websocketService = new WebSocketService();