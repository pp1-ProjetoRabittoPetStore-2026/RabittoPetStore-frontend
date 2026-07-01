import type { Employee } from '../employee/types';
import type { Agendamento } from '../agendamentos/types';



export interface AgendaFuncionario {
  funcionario: Employee;
  agendamentos: Agendamento[];
}

export interface AgendaFilters {
  data?: string;
  cargo?: string;
  status?: string;
  nome?: string;
}
