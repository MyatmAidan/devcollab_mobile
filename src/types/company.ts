export interface CompanyAccount {
  id: string;
  name: string;
  email: string;
}

export interface CompanyProfile {
  id: string;
  company_id: string;
  company_name: string;
  contact_email: string | null;
  website: string | null;
  location: string | null;
  description: string | null;
  logo: string | null;
  logo_url: string | null;
  company?: CompanyAccount;
}

export interface CompanyAuthPayload {
  company: CompanyProfile;
  token: string;
}

export interface CompanyLoginInput {
  email: string;
  password: string;
}

export interface CompanyRegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export type JobStatus = 'draft' | 'published' | 'closed';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';
export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';

export interface JobCategory {
  id: string;
  name_en: string;
  name_my: string;
  slug: string;
}

export interface CompanyJob {
  id: string;
  company_profile_id: string;
  category_id: string | null;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  salary_range: string | null;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel | null;
  status: JobStatus;
  published_at: string | null;
  created_at: string;
  category?: JobCategory;
  applications_count?: number;
}

export interface JobApplicant {
  id: string;
  job_posting_id: string;
  developer_profile_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  company_notes: string | null;
  applied_at: string;
  created_at: string;
  developer_profile?: {
    id: string;
    bio: string | null;
    location: string | null;
    experience_level: ExperienceLevel | null;
    cv_url: string | null;
    phone: string | null;
    category?: JobCategory;
    user?: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
  };
}

export interface UpdateApplicationInput {
  status: ApplicationStatus;
  company_notes?: string;
}

export interface CompanyJobPayload {
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  salary_range?: string;
  employment_type: EmploymentType;
  experience_level?: ExperienceLevel;
  status?: JobStatus;
  category_id?: string;
}
