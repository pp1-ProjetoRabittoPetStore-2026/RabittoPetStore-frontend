import api from '../api';
import type { Agendamento } from '../agendamentos/types';



export const getVetAgenda = async (data?: string): Promise<Agendamento[]> => {
  const response = await api.get<Agendamento[]>('/agendamentos/vet/agenda', {
    params: data ? { data } : undefined,
  });
  return response.data;
};
