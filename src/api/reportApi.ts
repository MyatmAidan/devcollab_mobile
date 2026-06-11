import { api } from './axios';
import type { ApiResponse } from '../types/api';

export interface ReportInput {
  reported_user_id: string;
  reason: string;
  description?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
}

export const REPORT_REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'inappropriate_content', label: 'Inappropriate content' },
  { value: 'fake_profile', label: 'Fake profile' },
  { value: 'other', label: 'Other' },
] as const;

export async function submitReport(data: ReportInput): Promise<Report> {
  const response = await api.post('/reports', data) as ApiResponse<Report>;
  return response.data;
}
