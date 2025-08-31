// src/services/notification.service.ts
import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';

/** Server enums/types */
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

/** UI payload „input”, compatibil cu Omit<Notification, 'id'|'timestamp'|'read'> */
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

/** (Opțional) semnale pentru marcare livrare */
export type DeliveryChannel = 'REST' | 'WS';

class NotificationService {
    /** Bază configurabilă (fallback pe /notifications dacă nu e setat în API_ENDPOINTS) */
    private base = (API_ENDPOINTS as any)?.NOTIFICATIONS?.BASE || '/notifications';

    /** GET /notifications?status=PENDING&limit=50 */
    public async fetchPending(limit = 50): Promise<ServerNotificationDto[]> {
        const url = `${this.base}?status=PENDING&limit=${encodeURIComponent(String(limit))}`;
        return httpService.get<ServerNotificationDto[]>(url);
    }

    /** PATCH /notifications/{id}/delivered?channel=REST|WS */
    public async markDelivered(id: number, channel: DeliveryChannel = 'REST'): Promise<void> {
        const url = `${this.base}/${id}/delivered?channel=${encodeURIComponent(channel)}`;
        await httpService.patch<void>(url, {});
    }

    /** PATCH /notifications/{id}/seen */
    public async markSeen(id: number): Promise<void> {
        const url = `${this.base}/${id}/seen`;
        await httpService.patch<void>(url, {});
    }

    /** POST /notifications/seen/by-chat/{chatId} */
    public async markSeenByChat(chatId: number): Promise<void> {
        const url = `${this.base}/seen/by-chat/${encodeURIComponent(String(chatId))}`;
        await httpService.post<void>(url, {});
    }

    /** Helper: marchează „delivered” în paralel, ignore errors */
    public async markManyDelivered(dtos: ServerNotificationDto[], channel: DeliveryChannel = 'REST'): Promise<void> {
        await Promise.allSettled(dtos.map(n => this.markDelivered(n.id, channel)));
    }

    /**
     * Transformă DTO server → payload UI (fără id/timestamp/read, care se pun în context).
     * Poți injecta i18n „t” dacă vrei textul din traduceri.
     */
    public toUi(dto: ServerNotificationDto, t?: (key: string) => string): UiNotificationInput {
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
    }
}

export const notificationService = new NotificationService();
