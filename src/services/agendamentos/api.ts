import api from '../api';
import type { Agendamento, ServicoStatus } from './types';

export const sortByDataHora = (lista: Agendamento[]): Agendamento[] =>
  [...lista].sort((a, b) => a.dataHora.localeCompare(b.dataHora));

export const agendamentosApi = {
  getAll: async (): Promise<Agendamento[]> => {
    const response = await api.get<Agendamento[]>('/agendamentos/status');
    return sortByDataHora(response.data);
  },

  getByStatus: async (status: ServicoStatus): Promise<Agendamento[]> => {
    const response = await api.get<Agendamento[]>(
      `/agendamentos/status/${status}`,
    );
    return sortByDataHora(response.data);
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
