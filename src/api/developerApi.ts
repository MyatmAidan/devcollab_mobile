import { api } from './axios';
import type { PaginatedResponse } from '../types/api';
import type { DeveloperFilters, DeveloperProfile } from '../types/developer';
import type { ApiResponse } from '../types/api';

export async function getDevelopers(filters: DeveloperFilters = {}): Promise<PaginatedResponse<DeveloperProfile>> {
  const response = await api.get('/developers', { params: filters }) as PaginatedResponse<DeveloperProfile>;
  return response;
}

export async function getDeveloper(id: string): Promise<DeveloperProfile> {
  const response = await api.get(`/developers/${id}`) as ApiResponse<DeveloperProfile>;
  return response.data;
}

export async function getSkills() {
  const response = await api.get('/skills') as PaginatedResponse<import('../types/developer').Skill>;
  return response.data;
}

export async function getCategories(): Promise<import('../types/developer').SkillCategory[]> {
  const response = await api.get('/categories') as { data: import('../types/developer').SkillCategory[] };
  return response.data;
}
