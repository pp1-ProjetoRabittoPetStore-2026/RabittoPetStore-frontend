import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50:  { value: 'oklch(0.97 0.01 88)' },
          100: { value: 'oklch(0.94 0.02 83)' },
          200: { value: 'oklch(0.89 0.04 77)' },
          300: { value: 'oklch(0.83 0.06 71)' },
          400: { value: 'oklch(0.78 0.07 68)' },
          500: { value: '#d4a373' },
          600: { value: 'oklch(0.63 0.08 65)' },
          700: { value: 'oklch(0.52 0.075 65)' },
          800: { value: 'oklch(0.42 0.065 65)' },
          900: { value: 'oklch(0.32 0.05 65)' },
          950: { value: 'oklch(0.22 0.04 65)' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
