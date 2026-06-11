import type { DeveloperProfile } from './developer';

export type JobStatus = 'draft' | 'open' | 'closed' | 'filled';
export type JobApplicationStatus =
  | 'pending'
  | 'reviewed'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface JobCategory {
  id: string;
  slug: string;
  name_en: string;
  name_my: string;
}

export interface CompanyProfile {
  id: string;
  company_name: string;
  description: string | null;
  logo: string | null;
  location: string | null;
  industry: string | null;
}

export interface JobPosting {
  id: string;
  category_id: string | null;
  category?: JobCategory | null;
  title: string;
  description: string;
  requirements: string | null;
  employment_type: string;
  experience_level: string | null;
  location: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  status: JobStatus;
  company_profile?: CompanyProfile;
  published_at: string | null;
}

export interface JobApplication {
  id: string;
  job_id: string;
  status: JobApplicationStatus;
  cover_letter: string | null;
  job?: JobPosting;
  created_at: string;
}

export interface JobFilters {
  search?: string;
  employment_type?: string;
  experience_level?: string;
  category_id?: string;
  page?: number;
  per_page?: number;
}
