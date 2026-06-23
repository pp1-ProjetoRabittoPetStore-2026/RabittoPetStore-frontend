import type { AgendaFuncionario, AgendaFilters } from './types';
import api from '../api';



export const getAgenda = async (
  filters: AgendaFilters = {},
): Promise<AgendaFuncionario[]> => {
  const params: Record<string, string> = {};
  if (filters.data) params.data = filters.data;
  if (filters.cargo) params.cargo = filters.cargo;
  if (filters.status) params.status = filters.status;
  if (filters.nome && filters.nome.trim()) params.nome = filters.nome.trim();

  const response = await api.get('/funcionarios/agenda', {
    params: Object.keys(params).length ? params : undefined,
  });
  return response.data;
};
