import axios from 'axios';
import type { Agendamento, ServicoStatus } from './types';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const agendamentosApi = {
  getAll: async (): Promise<Agendamento[]> => {
    const response = await api.get<Agendamento[]>('/agendamentos');
    return response.data;
  },

  updateStatus: async (
    id: number,
    status: ServicoStatus,
  ): Promise<Agendamento> => {
    const response = await api.patch<Agendamento>(
      `/agendamentos/${id}/status`,
      { status },
    );
    return response.data;
  },
};
