export type ServicoStatus =
  | 'Pendente'
  | 'Aguardando'
  | 'Em Serviço'
  | 'Pronto'
  | 'Confirmado'
  | 'Cancelado';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  porte: string;
  especie: string;
  idade: number;
}

export interface Agendamento {
  id: number;
  dataHora: string;
  status: ServicoStatus;
  pet: Pet;
  servico: Servico;
}
