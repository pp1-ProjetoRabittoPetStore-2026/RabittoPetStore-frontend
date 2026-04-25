import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from './api';
import type { Employee } from './types';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEmployee: Employee) => createEmployee(newEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Employee }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeactivateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deactivateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
