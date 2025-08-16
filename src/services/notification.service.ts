import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';

export interface BackendNotification {
  id: string;
  userId: string;
  type: 'message' | 'system' | 'request' | 'job_assigned' | 'job_completed';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  jobNotifications: boolean;
  systemNotifications: boolean;
}

class NotificationService {
  /**
   * Get user's recent notifications
   */
  public async getRecentNotifications(limit: number = 50): Promise<BackendNotification[]> {
    try {
      const response = await httpService.get<BackendNotification[]>(
        `/notifications?limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw new Error('Failed to get notifications');
    }
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string): Promise<void> {
    try {
      await httpService.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(): Promise<void> {
    try {
      await httpService.put('/notifications/read-all');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * Delete notification
   */
  public async deleteNotification(notificationId: string): Promise<void> {
    try {
      await httpService.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * Get notification preferences
   */
  public async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await httpService.get<NotificationPreferences>('/notifications/preferences');
      return response;
    } catch (error) {
      console.error('Failed to get notification preferences:', error);
      throw new Error('Failed to get notification preferences');
    }
  }

  /**
   * Update notification preferences
   */
  public async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await httpService.put<NotificationPreferences>('/notifications/preferences', preferences);
      return response;
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw new Error('Failed to update notification preferences');
    }
  }

  /**
   * Subscribe to push notifications
   */
  public async subscribeToPushNotifications(subscription: PushSubscription): Promise<void> {
    try {
      await httpService.post('/notifications/push-subscribe', {
        subscription: subscription.toJSON()
      });
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw new Error('Failed to subscribe to push notifications');
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  public async unsubscribeFromPushNotifications(): Promise<void> {
    try {
      await httpService.post('/notifications/push-unsubscribe');
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw new Error('Failed to unsubscribe from push notifications');
    }
  }
}

export const notificationService = new NotificationService();