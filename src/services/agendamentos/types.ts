export type ServicoStatus =
  | 'Pendente'
  | 'Aguardando'
  | 'Em Serviço'
  | 'Pronto'
  | 'Confirmado'
  | 'Rejeitado'
  | 'Cancelado';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

export interface Tutor {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  porte: string;
  especie: string;
  idade: number;
  tutor?: Tutor;
}

export interface Agendamento {
  id: number;
  dataHora: string;
  status: ServicoStatus;
  pet: Pet;
  servicos: Servico[];
}
