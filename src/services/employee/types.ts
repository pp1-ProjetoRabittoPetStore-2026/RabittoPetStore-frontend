export type Role = 'GERENTE' | 'CAIXA' | 'TOSADOR' | 'VETERINARIO';

export interface Employee {
  id?: number;
  nome: string;
  cargo: Role | string;
  cpf: string;
  telefone: string;
  senha?: string;
  ativo?: boolean;
}

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  GERENTE: [
    'Acesso Total',
    'Gerenciar Funcionários',
    'Relatórios Financeiros',
    'Estoque',
    'Vendas',
  ],
  CAIXA: ['Realizar Vendas', 'Consultar Produtos', 'Histórico de Vendas Próprias'],
  TOSADOR: ['Acessar Agenda de Banho/Tosa', 'Atualizar Status de Serviço'],
  VETERINARIO: ['Acessar Prontuários', 'Acessar Agenda de Consultas', 'Prescrever Receitas'],
};
