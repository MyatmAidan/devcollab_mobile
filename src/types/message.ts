import type { User } from './user';
import type { Connection } from './connection';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  type: string;
  read_at: string | null;
  sender?: User;
  created_at: string;
}

export interface Conversation {
  id: string;
  connection_id: string;
  last_message_at: string | null;
  connection?: Connection;
  last_message?: Message | null;
}

export interface StoreMessageInput {
  body: string;
  type?: string;
}
