import type { Servico } from './types';
import api from '../api';

export const getServicos = async (): Promise<Servico[]> => {
  const response = await api.get('/servicos');
  return response.data;
};

export const createServico = async (servico: Servico): Promise<Servico> => {
  const response = await api.post('/servicos', servico);
  return response.data;
};

export const updateServico = async (
  id: number,
  servico: Servico,
): Promise<Servico> => {
  const response = await api.put(`/servicos/${id}`, servico);
  return response.data;
};

export const deleteServico = async (id: number): Promise<void> => {
  await api.delete(`/servicos/${id}`);
};
