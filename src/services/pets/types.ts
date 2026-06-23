export interface PetTutor {
  id: number;
  nome: string;
}

export interface Pet {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  porte?: string;
  idade?: number;
  tutor?: PetTutor;
}
