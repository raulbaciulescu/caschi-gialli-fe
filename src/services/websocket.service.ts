import { API_CONFIG } from '../config/api';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
}

export interface ChatRoom {
  id: string;
  customerId: string;
  customerName: string;
  customerPhoneNumber?: string;
  cgId: string;
  cgName: string;
  cgPhoneNumber?: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
}

interface WebSocketPayload {
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
  private heartbeatInterval: NodeJS.Timeout | null = null;

  public connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userId = userId;

      let wsUrl: string;
      if (import.meta.env.VITE_WS_URL) {
        wsUrl = `${import.meta.env.VITE_WS_URL}?userId=${userId}`;
      } else {
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
          this.startHeartbeat();
          this.sendUserStatus('online');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const payload: WebSocketPayload = JSON.parse(event.data);
            this.handleMessage(payload);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.stopHeartbeat();
          
          if (event.code !== 1000) {
            this.attemptReconnect();
          }
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
      this.sendUserStatus('offline');
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.isConnected = false;
    this.stopHeartbeat();
    this.messageHandlers.clear();
  }

  public sendMessage(chatId: string, content: string, type: 'text' | 'image' = 'text'): void {
    if (!this.isConnected || !this.ws || !this.userId) {
      console.error('WebSocket not connected');
      return;
    }

    const payload: WebSocketPayload = {
      type: 'chat_message',
      data: {
        chatId,
        senderId: this.userId,
        content,
        messageType: type,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(payload));
  }

  public createChat(customerId: string, cgId: string): void {
    if (!this.isConnected || !this.ws) {
      console.error('WebSocket not connected');
      return;
    }

    const payload: WebSocketPayload = {
      type: 'create_chat',
      data: {
        customerId,
        cgId,
        initiatorId: this.userId
      }
    };

    this.ws.send(JSON.stringify(payload));
  }

  public sendUserStatus(status: 'online' | 'offline'): void {
    if (!this.isConnected || !this.ws || !this.userId) return;

    const payload: WebSocketPayload = {
      type: 'user_status',
      data: {
        userId: this.userId,
        status,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(payload));
  }

  public sendUserActivity(): void {
    if (!this.isConnected || !this.ws || !this.userId) return;

    const payload: WebSocketPayload = {
      type: 'user_activity',
      data: {
        userId: this.userId,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(payload));
  }

  public sendHeartbeat(): void {
    if (!this.isConnected || !this.ws || !this.userId) return;

    const payload: WebSocketPayload = {
      type: 'heartbeat',
      data: {
        userId: this.userId,
        timestamp: new Date().toISOString()
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

  private handleMessage(payload: WebSocketPayload): void {
    const { type, data } = payload;
    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(data);
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
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