import { useQuery } from '@tanstack/react-query';
import { petsApi } from './api';

export const usePets = () => {
  return useQuery({
    queryKey: ['pets'],
    queryFn: petsApi.getAll,
    staleTime: 1000 * 60,
  });
};
