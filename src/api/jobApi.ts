import { api } from './axios';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { JobApplication, JobFilters, JobPosting } from '../types/job';

export async function getJobs(filters: JobFilters = {}): Promise<PaginatedResponse<JobPosting>> {
  const response = await api.get('/jobs', { params: filters }) as PaginatedResponse<JobPosting>;
  return response;
}

export async function getJob(id: string): Promise<JobPosting> {
  const response = await api.get(`/jobs/${id}`) as ApiResponse<JobPosting>;
  return response.data;
}

export async function applyToJob(id: string, coverLetter?: string): Promise<JobApplication> {
  const response = await api.post(`/jobs/${id}/apply`, {
    cover_letter: coverLetter,
  }) as ApiResponse<JobApplication>;
  return response.data;
}

export async function getMyApplications(page = 1): Promise<PaginatedResponse<JobApplication>> {
  const response = await api.get('/job-applications/me', { params: { page } }) as PaginatedResponse<JobApplication>;
  return response;
}

export async function withdrawApplication(id: string): Promise<JobApplication> {
  const response = await api.post(`/job-applications/${id}/withdraw`) as ApiResponse<JobApplication>;
  return response.data;
}
