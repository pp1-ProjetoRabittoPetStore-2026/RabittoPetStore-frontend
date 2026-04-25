import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Login } from './types';
import * as authApi from './api';
import { authService } from './storage';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: Login) => {
      const response = await authApi.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      authService.setToken(data.accessToken); // Salva no localStorage
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
