import type { Employee } from './types';
import api from '../api';

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/funcionarios');
  return response.data;
};

export const createEmployee = async (employee: Employee): Promise<Employee> => {
  const response = await api.post('/funcionarios', employee);
  return response.data;
};

export const updateEmployee = async (
  id: number,
  employee: Employee,
): Promise<Employee> => {
  const response = await api.put(`/funcionarios/${id}`, employee);
  return response.data;
};

export const deactivateEmployee = async (id: number): Promise<void> => {
  await api.delete(`/funcionarios/${id}`);
};
