import { api } from './axios';
import type { PaginatedResponse } from '../types/api';
import type { Notification } from '../types/user';

export async function getNotifications(): Promise<Notification[]> {
  const response = await api.get('/notifications') as PaginatedResponse<Notification>;
  return response.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post('/notifications/read-all');
}
