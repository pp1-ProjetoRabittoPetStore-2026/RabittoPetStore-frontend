import api from '../api';
import type { Login, LoginResponse } from './types';

export async function login(credentials: Login): Promise<LoginResponse> {
  

  const { data } = await api.post<LoginResponse>(
    '/auth/staff/login',
    credentials,
  );
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function refreshToken(): Promise<{ token: string }> {
  const { data } = await api.post<{ token: string }>('/auth/refresh');
  return data;
}
