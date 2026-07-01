import type { MaskOptions, Replacement } from '@react-input/mask';



const DIGIT: Replacement = { _: /\d/ };



export const MASKS = {
  cpf: { mask: '___.___.___-__', replacement: DIGIT },
  telefone: { mask: '(__) _____-____', replacement: DIGIT },
  cep: { mask: '_____-___', replacement: DIGIT },
} satisfies Record<string, MaskOptions>;
