import { api } from './axios';
import type { ApiResponse } from '../types/api';

export interface TelegramLinkToken {
  token: string;
  expires_at: string;
}

export async function createTelegramLinkToken(): Promise<TelegramLinkToken> {
  const response = await api.post('/telegram/link-token') as ApiResponse<TelegramLinkToken>;
  return response.data;
}

export async function sendTelegramTest(): Promise<void> {
  await api.post('/telegram/test');
}

export async function updateTelegramSettings(telegram_notify_enabled: boolean): Promise<void> {
  await api.put('/telegram/settings', { telegram_notify_enabled });
}

export async function disconnectTelegram(): Promise<void> {
  await api.delete('/telegram/disconnect');
}

export function buildTelegramBotUrl(linkToken: string): string {
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot_username';
  return `https://t.me/${botUsername}?start=${linkToken}`;
}
