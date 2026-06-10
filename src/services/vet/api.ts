import api from '../api';
import type { Agendamento } from '../agendamentos/types';

// Agenda do veterinário logado: apenas suas consultas, em ordem cronológica.
export const getVetAgenda = async (data?: string): Promise<Agendamento[]> => {
  const response = await api.get<Agendamento[]>('/agendamentos/vet/agenda', {
    params: data ? { data } : undefined,
  });
  return response.data;
};
