import { api } from './axios';
import type { ApiResponse } from '../types/api';
import type { AuthPayload, LoginInput, RegisterInput, User } from '../types/user';

export async function register(data: RegisterInput): Promise<AuthPayload> {
  const response = await api.post('/auth/register', data) as ApiResponse<AuthPayload>;
  return response.data;
}

export async function login(data: LoginInput): Promise<AuthPayload> {
  const response = await api.post('/auth/login', data) as ApiResponse<AuthPayload>;
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get('/auth/me') as ApiResponse<User>;
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
