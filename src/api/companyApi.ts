import axios from 'axios';
import { getApiRoot } from '../lib/apiConfig';
import { getCompanyToken } from '../services/companyTokenService';
import type { ApiResponse } from '../types/api';
import type {
  CompanyAuthPayload,
  CompanyJob,
  CompanyJobPayload,
  CompanyLoginInput,
  CompanyProfile,
  CompanyRegisterInput,
  JobApplicant,
  JobCategory,
  UpdateApplicationInput,
} from '../types/company';

function getBaseUrl(): string {
  return `${getApiRoot()}/api/v1/company`;
}

const companyApi = axios.create({
  headers: { Accept: 'application/json' },
});

companyApi.interceptors.request.use(async (config) => {
  const token = await getCompanyToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.baseURL = getBaseUrl();
  return config;
});

// Auth
export async function companyLogin(data: CompanyLoginInput): Promise<CompanyAuthPayload> {
  const res = await companyApi.post<ApiResponse<CompanyAuthPayload>>('/auth/login', data);
  return res.data.data;
}

export async function companyRegister(data: CompanyRegisterInput): Promise<CompanyAuthPayload> {
  const res = await companyApi.post<ApiResponse<CompanyAuthPayload>>('/auth/register', data);
  return res.data.data;
}

export async function getCompanyMe(): Promise<CompanyProfile> {
  const res = await companyApi.get<ApiResponse<CompanyProfile>>('/auth/me');
  return res.data.data;
}

export async function companyLogout(): Promise<void> {
  await companyApi.post('/auth/logout');
}

// Profile
export async function getCompanyProfile(): Promise<CompanyProfile> {
  const res = await companyApi.get<ApiResponse<CompanyProfile>>('/profile');
  return res.data.data;
}

export async function updateCompanyProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
  const res = await companyApi.put<ApiResponse<CompanyProfile>>('/profile', data);
  return res.data.data;
}

export async function uploadCompanyLogo(file: File): Promise<CompanyProfile> {
  const form = new FormData();
  form.append('logo', file);
  const res = await companyApi.post<ApiResponse<CompanyProfile>>('/profile/logo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

// Categories
export async function getCompanyCategories(): Promise<JobCategory[]> {
  const res = await companyApi.get<ApiResponse<JobCategory[]>>('/categories');
  return res.data.data;
}

// Jobs
export async function getCompanyJobs(): Promise<CompanyJob[]> {
  const res = await companyApi.get<ApiResponse<{ data: CompanyJob[] }>>('/jobs');
  return (res.data.data as unknown as { data: CompanyJob[] }).data ?? res.data.data as unknown as CompanyJob[];
}

export async function createCompanyJob(data: CompanyJobPayload): Promise<CompanyJob> {
  const res = await companyApi.post<ApiResponse<CompanyJob>>('/jobs', data);
  return res.data.data;
}

export async function getCompanyJob(id: string): Promise<CompanyJob> {
  const res = await companyApi.get<ApiResponse<CompanyJob>>(`/jobs/${id}`);
  return res.data.data;
}

export async function updateCompanyJob(id: string, data: Partial<CompanyJobPayload>): Promise<CompanyJob> {
  const res = await companyApi.put<ApiResponse<CompanyJob>>(`/jobs/${id}`, data);
  return res.data.data;
}

export async function deleteCompanyJob(id: string): Promise<void> {
  await companyApi.delete(`/jobs/${id}`);
}

// Applications
export async function getJobApplications(jobId: string): Promise<JobApplicant[]> {
  const res = await companyApi.get<ApiResponse<{ data: JobApplicant[] }>>(`/jobs/${jobId}/applications`);
  return (res.data.data as unknown as { data: JobApplicant[] }).data ?? res.data.data as unknown as JobApplicant[];
}

export async function getApplication(applicationId: string): Promise<JobApplicant> {
  const res = await companyApi.get<ApiResponse<JobApplicant>>(`/applications/${applicationId}`);
  return res.data.data;
}

export async function updateApplication(
  applicationId: string,
  data: UpdateApplicationInput,
): Promise<JobApplicant> {
  const res = await companyApi.patch<ApiResponse<JobApplicant>>(`/applications/${applicationId}`, data);
  return res.data.data;
}
