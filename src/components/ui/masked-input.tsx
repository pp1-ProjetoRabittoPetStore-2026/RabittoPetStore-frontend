import { forwardRef } from 'react';
import { Input, type InputProps } from '@chakra-ui/react';
import { useMask, type MaskOptions } from '@react-input/mask';

export interface MaskedInputProps extends Omit<InputProps, keyof MaskOptions>, MaskOptions {}







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
