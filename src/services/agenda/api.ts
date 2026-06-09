import type { AgendaFuncionario } from './types';
import api from '../api';

// data no formato ISO yyyy-MM-dd; omitido = dia atual (default do backend)
export const getAgenda = async (
  data?: string,
): Promise<AgendaFuncionario[]> => {
  const response = await api.get('/funcionarios/agenda', {
    params: data ? { data } : undefined,
  });
  return response.data;
};
