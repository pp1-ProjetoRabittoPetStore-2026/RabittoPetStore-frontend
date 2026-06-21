import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { authService } from './auth/storage';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUISIÇÃO: Adiciona o token no Header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken();

    if (token && config.headers) {
      // Padrão Bearer Token
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de RESPOSTA: Trata erros globais (ex: 401 Unauthorized)
//
// Sessões do back-office (funcionário) são apenas access-token: o backend não
// emite refresh token para staff. Portanto, em 401 a única ação correta é
// encerrar a sessão e mandar para o login — sem tentativa de refresh.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';

    // Ignora os próprios endpoints de auth para não criar loop de redirect.
    if (status === 401 && !url.includes('/auth/')) {
      authService.removeToken();

      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
