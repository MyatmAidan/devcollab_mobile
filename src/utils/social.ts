import type { Connection } from '../types/connection';
import type { Conversation } from '../types/message';
import type { User } from '../types/user';

export function getOtherUser(connection: Connection, currentUserId: string): User | undefined {
  if (connection.user_one_id === currentUserId) return connection.user_two;
  return connection.user_one;
}

export function getOtherUserFromConversation(
  conversation: Conversation,
  currentUserId: string,
): User | undefined {
  const connection = conversation.connection;
  if (!connection) return undefined;
  return getOtherUser(connection, currentUserId);
}

export function formatMessageTime(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
