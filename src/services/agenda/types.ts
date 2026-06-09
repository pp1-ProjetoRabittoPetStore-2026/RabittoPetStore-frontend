import type { Employee } from '../employee/types';
import type { Agendamento } from '../agendamentos/types';

// Espelha o retorno de GET /funcionarios/agenda
export interface AgendaFuncionario {
  funcionario: Employee;
  agendamentos: Agendamento[];
}
