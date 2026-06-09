import { useQuery } from '@tanstack/react-query';
import { getAgenda } from './api';

export const useAgenda = (data?: string) => {
  return useQuery({
    queryKey: ['agenda', data ?? 'hoje'],
    queryFn: () => getAgenda(data),
  });
};
