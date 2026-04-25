import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agendamentosApi } from './api';
import type { Agendamento, ServicoStatus } from './types';

const AGENDAMENTOS_KEY = ['agendamentos'];

export const useAgendamentos = () => {
  return useQuery({
    queryKey: AGENDAMENTOS_KEY,
    queryFn: agendamentosApi.getAll,
    staleTime: 1000 * 30,
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ServicoStatus }) =>
      agendamentosApi.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: AGENDAMENTOS_KEY });
      const previous =
        queryClient.getQueryData<Agendamento[]>(AGENDAMENTOS_KEY);
      queryClient.setQueryData<Agendamento[]>(AGENDAMENTOS_KEY, (old) =>
        old ? old.map((a) => (a.id === id ? { ...a, status } : a)) : [],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(AGENDAMENTOS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_KEY });
    },
  });
};
