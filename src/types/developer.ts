import type { User } from './user';

export interface SkillCategory {
  id: string;
  slug: string;
  name_en: string;
  name_my: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category?: SkillCategory | null;
}

export type ConnectionStatus =
  | 'none'
  | 'self'
  | 'pending_sent'
  | 'pending_received'
  | 'connected';

export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';

export interface DeveloperProfile {
  id: string;
  user_id: string;
  category_id: string | null;
  category?: SkillCategory | null;
  profile_photo: string | null;
  headline: string | null;
  bio: string | null;
  role_title: string | null;
  experience_level: ExperienceLevel | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  phone: string | null;
  cv_path: string | null;
  cv_original_name: string | null;
  is_public: boolean;
  user?: User;
  skills?: Skill[];
  connection_status?: ConnectionStatus;
  connection_id?: string | null;
  conversation_id?: string | null;
  connection_request_id?: string | null;
  created_at: string;
}

export interface DeveloperFilters {
  search?: string;
  role?: string;
  skill?: string;
  experience_level?: string;
  page?: number;
  per_page?: number;
}

export interface ProfileInput {
  category_id?: string | null;
  profile_photo?: string;
  headline?: string;
  bio?: string;
  experience_level?: ExperienceLevel | null;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  phone?: string;
  is_public?: boolean;
  skill_ids?: string[];
}
