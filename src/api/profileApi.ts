import { api } from './axios';
import type { ApiResponse } from '../types/api';
import type { DeveloperProfile, ProfileInput } from '../types/developer';

export async function getMyProfile(): Promise<DeveloperProfile | null> {
  const response = await api.get('/profile/me') as ApiResponse<DeveloperProfile | null>;
  return response.data;
}

export async function createProfile(data: ProfileInput): Promise<DeveloperProfile> {
  const response = await api.post('/profile', data) as ApiResponse<DeveloperProfile>;
  return response.data;
}

export async function updateProfile(data: ProfileInput): Promise<DeveloperProfile> {
  const response = await api.put('/profile/me', data) as ApiResponse<DeveloperProfile>;
  return response.data;
}

export async function uploadProfilePhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/profile/me/photo', formData) as ApiResponse<{ profile_photo: string }>;
  return response.data.profile_photo;
}

export async function uploadProfileCv(file: File): Promise<{ cv_path: string; cv_original_name: string }> {
  const formData = new FormData();
  formData.append('cv', file);
  const response = await api.post('/profile/me/cv', formData) as ApiResponse<{ cv_path: string; cv_original_name: string }>;
  return response.data;
}
