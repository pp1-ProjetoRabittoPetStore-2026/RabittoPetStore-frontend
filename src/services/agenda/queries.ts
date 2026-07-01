import { useQuery } from '@tanstack/react-query';
import { getAgenda } from './api';
import type { AgendaFilters } from './types';

export const useAgenda = (filters: AgendaFilters = {}) => {
  return useQuery({
    queryKey: [
      'agenda',
      filters.data ?? 'hoje',
      filters.cargo ?? 'todos',
      filters.status ?? 'todos',
      filters.nome ?? '',
    ],
    queryFn: () => getAgenda(filters),
  });
};
