// services/notification.api.ts
import { API_CONFIG } from '../config/api';

export type NotificationStatus = 'PENDING'|'DELIVERED'|'SEEN'|'DISMISSED';

export interface NotificationDto {
    id: number;
    kind: 'MESSAGE_NEW'|'CHAT_CREATED';
    chatId?: number;
    messageId?: number;
    fromUserId?: number;
    preview?: string;
    createdAt: string;
    status: NotificationStatus;
}

const base = API_CONFIG.BASE_URL;


export async function markNotificationRead(id: string): Promise<void> {
    await httpService.patch(`/notifications/${id}`, { read: true });
}

export async function markNotificationsRead(ids: string[]): Promise<void> {
    await httpService.post(`/notifications/mark-read`, { ids });
}

export const notificationApi = {
    async getPending(limit = 50): Promise<NotificationDto[]> {
        const res = await fetch(`${base}/notifications?status=PENDING&limit=${limit}`, {
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
    },

    async markDelivered(id: number, channel: 'REST'|'WS' = 'REST'): Promise<void> {
        await fetch(`${base}/notifications/${id}/delivered?channel=${channel}`, {
            method: 'PATCH',
            credentials: 'include'
        });
    },

    async markSeen(id: number): Promise<void> {
        await fetch(`${base}/notifications/${id}/seen`, {
            method: 'PATCH',
            credentials: 'include'
        });
    },

    async markSeenByChat(chatId: number): Promise<void> {
        await fetch(`${base}/notifications/seen/by-chat/${chatId}`, {
            method: 'POST',
            credentials: 'include'
        });
    }
};
