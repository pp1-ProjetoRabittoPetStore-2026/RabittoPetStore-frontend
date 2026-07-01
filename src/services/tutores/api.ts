import api from '../api';
import type { Tutor } from './types';

export const tutoresApi = {
  getAll: async (): Promise<Tutor[]> => {
    const response = await api.get<Tutor[]>('/tutores');
    return response.data;
  },
};
