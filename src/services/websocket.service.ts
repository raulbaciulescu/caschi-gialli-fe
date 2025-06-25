import { API_CONFIG } from '../config/api';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
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
      
      // Dynamically construct WebSocket URL from API base URL
      let wsUrl: string;
      if (import.meta.env.VITE_WS_URL) {
        wsUrl = import.meta.env.VITE_WS_URL;
      } else {
        // Convert HTTP/HTTPS base URL to WebSocket URL
        const baseUrl = API_CONFIG.BASE_URL;
        wsUrl = baseUrl.replace(/^https?:\/\//, (match) => {
          return match === 'https://' ? 'wss://' : 'ws://';
        }) + '/ws';
      }
      
      try {
        this.ws = new WebSocket(`${wsUrl}?userId=${userId}`);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
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

    const message = {
      type: 'chat_message',
      data: {
        chatId,
        content,
        messageType: type,
        senderId: this.userId,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  public joinChat(chatId: string): void {
    if (!this.isConnected || !this.ws) {
      console.error('WebSocket not connected');
      return;
    }

    const message = {
      type: 'join_chat',
      data: { chatId }
    };

    this.ws.send(JSON.stringify(message));
  }

  public leaveChat(chatId: string): void {
    if (!this.isConnected || !this.ws) {
      console.error('WebSocket not connected');
      return;
    }

    const message = {
      type: 'leave_chat',
      data: { chatId }
    };

    this.ws.send(JSON.stringify(message));
  }

  public createChat(participantIds: string[], participantNames: string[]): void {
    if (!this.isConnected || !this.ws) {
      console.error('WebSocket not connected');
      return;
    }

    const message = {
      type: 'create_chat',
      data: {
        participantIds,
        participantNames
      }
    };

    this.ws.send(JSON.stringify(message));
  }

  public onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  public offMessage(type: string): void {
    this.messageHandlers.delete(type);
  }

  private handleMessage(data: any): void {
    const { type, data: messageData } = data;
    const handler = this.messageHandlers.get(type);
    
    if (handler) {
      handler(messageData);
    } else {
      console.log('Unhandled WebSocket message type:', type);
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