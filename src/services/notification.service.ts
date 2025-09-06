import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';
import { NotificationPreferences, NotificationPreferencesResponse } from "../types/api.ts";

export type ServerNotifStatus = 'PENDING' | 'DELIVERED' | 'SEEN' | 'DISMISSED';
export type ServerNotifKind = 'MESSAGE_NEW' | 'CHAT_CREATED';

export interface ServerNotificationDto {
    id: number;
    kind: ServerNotifKind;
    chatId?: number;
    messageId?: number;
    fromUserId?: number;
    preview?: string;
    createdAt: string;        // ISO date
    status: ServerNotifStatus;
}

export interface UiNotificationInput {
    type: 'message' | 'system' | 'request' | 'job_assigned' | 'job_completed';
    title: string;
    message: string;
    chatId?: string;
    senderId?: string;
    senderName?: string;
    avatar?: string;
    data?: any;
}

export type DeliveryChannel = 'REST' | 'WS';

class NotificationService {
    private base = (API_ENDPOINTS as any)?.NOTIFICATIONS?.BASE || '/notifications';

    public fetchPending = async (limit = 50): Promise<ServerNotificationDto[]> => {
        const url = `${this.base}?status=PENDING&limit=${encodeURIComponent(String(limit))}`;
        return httpService.get<ServerNotificationDto[]>(url);
    };

    public markDelivered = async (id: number, channel: DeliveryChannel = 'REST'): Promise<void> => {
        const url = `${this.base}/${id}/delivered?channel=${encodeURIComponent(channel)}`;
        await httpService.patch<void>(url, {});
    };

    public markSeen = async (id: number): Promise<void> => {
        const url = `${this.base}/${id}/seen`;
        await httpService.patch<void>(url, {});
    };

    public markSeenByChat = async (chatId: number): Promise<void> => {
        const url = `${this.base}/seen/by-chat/${encodeURIComponent(String(chatId))}`;
        await httpService.post<void>(url, {});
    };

    public getNotificationPreferences = async (): Promise<NotificationPreferencesResponse> => {
        const url = `${this.base}/preferences`;
        return httpService.get<NotificationPreferencesResponse>(url);
    };

    public updateNotificationPreferences = async (preferences: NotificationPreferences): Promise<NotificationPreferencesResponse> => {
        const url = `${this.base}/preferences`;
        return httpService.put<NotificationPreferencesResponse>(url, { preferences });
    };

    public markManyDelivered = async (dtos: ServerNotificationDto[], channel: DeliveryChannel = 'REST'): Promise<void> => {
        await Promise.allSettled(dtos.map(n => this.markDelivered(n.id, channel)));
    };

    public toUi = (dto: ServerNotificationDto, t?: (key: string) => string): UiNotificationInput => {
        const isMessage = dto.kind === 'MESSAGE_NEW';

        const defaultTitles = {
            message: t ? t('notifications.newMessage2') : 'New message',
            chat: 'New conversation',
        };

        const title = isMessage ? defaultTitles.message : defaultTitles.chat;
        const message =
            dto.preview ??
            (isMessage ? (t ? t('notifications.newMessage2') : 'New message') : 'New chat');

        return {
            type: isMessage ? 'message' : 'system',
            title,
            message,
            chatId: dto.chatId ? String(dto.chatId) : undefined,
            senderId: dto.fromUserId ? String(dto.fromUserId) : undefined,
            data: {
                notificationId: dto.id,
                kind: dto.kind,
                chatId: dto.chatId,
                messageId: dto.messageId,
                createdAt: dto.createdAt,
                status: dto.status,
            },
        };
    };
}

export const notificationService = new NotificationService();
