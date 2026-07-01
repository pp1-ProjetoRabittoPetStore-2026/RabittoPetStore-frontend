import { useQuery } from '@tanstack/react-query';
import { tutoresApi } from './api';

export const useTutores = () => {
  return useQuery({
    queryKey: ['tutores'],
    queryFn: tutoresApi.getAll,
    staleTime: 1000 * 60,
  });
};
