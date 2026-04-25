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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se a API retornar 401, o token expirou ou é inválido
    if (error.response && error.response.status === 401) {
      authService.removeToken();

      // Opcional: Redirecionar para o login
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default api;
