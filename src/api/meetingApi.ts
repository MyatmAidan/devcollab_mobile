import { api } from './axios';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { Meeting, StoreMeetingInput, UpdateMeetingInput } from '../types/meeting';

export async function getMeetings(): Promise<Meeting[]> {
  const response = await api.get('/meetings') as PaginatedResponse<Meeting>;
  return response.data;
}

export async function createMeeting(data: StoreMeetingInput): Promise<Meeting> {
  const response = await api.post('/meetings', data) as ApiResponse<Meeting>;
  return response.data;
}

export async function getMeeting(id: string): Promise<Meeting> {
  const response = await api.get(`/meetings/${id}`) as ApiResponse<Meeting>;
  return response.data;
}

export async function updateMeeting(id: string, data: UpdateMeetingInput): Promise<Meeting> {
  const response = await api.put(`/meetings/${id}`, data) as ApiResponse<Meeting>;
  return response.data;
}

export async function cancelMeeting(id: string): Promise<Meeting> {
  const response = await api.post(`/meetings/${id}/cancel`) as ApiResponse<Meeting>;
  return response.data;
}

export async function completeMeeting(id: string): Promise<Meeting> {
  const response = await api.post(`/meetings/${id}/complete`) as ApiResponse<Meeting>;
  return response.data;
}
