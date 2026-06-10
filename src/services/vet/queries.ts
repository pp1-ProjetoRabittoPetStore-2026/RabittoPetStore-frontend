import { useQuery } from '@tanstack/react-query';
import { getVetAgenda } from './api';

export const useVetAgenda = (data?: string) => {
  return useQuery({
    queryKey: ['vet-agenda', data ?? 'hoje'],
    queryFn: () => getVetAgenda(data),
  });
};
