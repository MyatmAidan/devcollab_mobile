import { api } from './axios';
import { getSocketId } from '../services/echoService';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { Conversation, Message, StoreMessageInput } from '../types/message';

export async function getConversations(): Promise<Conversation[]> {
  const response = await api.get('/conversations') as PaginatedResponse<Conversation>;
  return response.data;
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await api.get(`/conversations/${id}`) as ApiResponse<Conversation>;
  return response.data;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await api.get(`/conversations/${conversationId}/messages`) as PaginatedResponse<Message>;
  return response.data;
}

export async function sendMessage(conversationId: string, data: StoreMessageInput): Promise<Message> {
  const socketId = await getSocketId();
  const response = await api.post(
    `/conversations/${conversationId}/messages`,
    data,
    socketId ? { headers: { 'X-Socket-Id': socketId } } : undefined,
  ) as ApiResponse<Message>;
  return response.data;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  await api.post(`/conversations/${conversationId}/read`);
}
