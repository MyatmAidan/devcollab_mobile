import type { User } from './user';

export interface ConversationPreview {
  id: string;
  connection_id: string;
  last_message_at: string | null;
}

export interface Connection {
  id: string;
  user_one_id: string;
  user_two_id: string;
  user_one?: User;
  user_two?: User;
  conversation?: ConversationPreview;
  created_at: string;
}

export interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  sender?: User;
  receiver?: User;
  created_at: string;
}

export interface StoreConnectionRequestInput {
  receiver_id: string;
  message?: string;
}
