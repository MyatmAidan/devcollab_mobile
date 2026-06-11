import type { DeveloperProfile } from './developer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  status: string;
  last_active_at: string | null;
  telegram_username: string | null;
  telegram_notify_enabled: boolean;
  telegram_linked_at: string | null;
  developer_profile?: DeveloperProfile | null;
  created_at: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Notification {
  id: string;
  channel: string;
  type: string;
  title: string;
  body: string;
  status: string;
  read_at: string | null;
  sent_at: string | null;
  created_at: string;
}
