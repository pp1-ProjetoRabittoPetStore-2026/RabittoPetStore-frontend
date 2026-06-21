import { forwardRef } from 'react';
import { Input, type InputProps } from '@chakra-ui/react';
import { useMask, type MaskOptions, type Replacement } from '@react-input/mask';

// Substituição padrão: cada "_" aceita apenas um dígito.
const DIGIT: Replacement = { _: /\d/ };

// Máscaras de domínio reutilizáveis (pt-BR).
export const MASKS = {
  cpf: { mask: '___.___.___-__', replacement: DIGIT },
  telefone: { mask: '(__) _____-____', replacement: DIGIT },
  cep: { mask: '_____-___', replacement: DIGIT },
} satisfies Record<string, MaskOptions>;

export interface MaskedInputProps extends Omit<InputProps, keyof MaskOptions>, MaskOptions {}

// Input do Chakra com máscara via @react-input/mask. O `useMask` controla
// o DOM e dispara o evento nativo de input, então o ref do RHF (passado via
// {...register('campo')}) recebe o valor já formatado.
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, replacement, showMask, separate, track, modify, ...rest }, ref) => {
    const maskRef = useMask({ mask, replacement, showMask, separate, track, modify });
    return <Input ref={mergeRefs(ref, maskRef)} {...rest} />;
  },
);

MaskedInput.displayName = 'MaskedInput';
