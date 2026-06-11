import { api } from './axios';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type {
  Connection,
  ConnectionRequest,
  StoreConnectionRequestInput,
} from '../types/connection';

export async function sendConnectionRequest(data: StoreConnectionRequestInput): Promise<ConnectionRequest> {
  const response = await api.post('/connection-requests', data) as ApiResponse<ConnectionRequest>;
  return response.data;
}

export async function getReceivedRequests(): Promise<ConnectionRequest[]> {
  const response = await api.get('/connection-requests/received') as PaginatedResponse<ConnectionRequest>;
  return response.data;
}

export async function getSentRequests(): Promise<ConnectionRequest[]> {
  const response = await api.get('/connection-requests/sent') as PaginatedResponse<ConnectionRequest>;
  return response.data;
}

export async function acceptRequest(id: string): Promise<Connection> {
  const response = await api.post(`/connection-requests/${id}/accept`) as ApiResponse<Connection>;
  return response.data;
}

export async function rejectRequest(id: string): Promise<ConnectionRequest> {
  const response = await api.post(`/connection-requests/${id}/reject`) as ApiResponse<ConnectionRequest>;
  return response.data;
}

export async function cancelRequest(id: string): Promise<ConnectionRequest> {
  const response = await api.post(`/connection-requests/${id}/cancel`) as ApiResponse<ConnectionRequest>;
  return response.data;
}

export async function getConnections(): Promise<Connection[]> {
  const response = await api.get('/connections') as PaginatedResponse<Connection>;
  return response.data;
}

export async function getConnection(id: string): Promise<Connection> {
  const response = await api.get(`/connections/${id}`) as ApiResponse<Connection>;
  return response.data;
}

export async function deleteConnection(id: string): Promise<void> {
  await api.delete(`/connections/${id}`);
}
