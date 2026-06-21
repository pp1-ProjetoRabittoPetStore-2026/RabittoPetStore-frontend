import type { MaskOptions, Replacement } from '@react-input/mask';

// Substituição padrão: cada "_" aceita apenas um dígito.
const DIGIT: Replacement = { _: /\d/ };

// Máscaras de domínio reutilizáveis (pt-BR).
export const MASKS = {
  cpf: { mask: '___.___.___-__', replacement: DIGIT },
  telefone: { mask: '(__) _____-____', replacement: DIGIT },
  cep: { mask: '_____-___', replacement: DIGIT },
} satisfies Record<string, MaskOptions>;
