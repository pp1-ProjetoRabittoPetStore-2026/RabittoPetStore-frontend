import api from '../api';
import type { Pet } from './types';

export const petsApi = {
  getAll: async (): Promise<Pet[]> => {
    const response = await api.get<Pet[]>('/pets');
    return response.data;
  },
};
