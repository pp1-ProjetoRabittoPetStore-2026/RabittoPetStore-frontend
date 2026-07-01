import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getServicos,
  createServico,
  updateServico,
  deleteServico,
} from './api';
import type { Servico } from './types';

export const useServicos = () => {
  return useQuery({
    queryKey: ['servicos'],
    queryFn: getServicos,
  });
};

export const useCreateServico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (novo: Servico) => createServico(novo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
    },
  });
};

export const useUpdateServico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Servico }) =>
      updateServico(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
    },
  });
};

export const useDeleteServico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteServico(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
    },
  });
};
