import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50:  { value: 'oklch(0.97 0.02 60)' },
          100: { value: 'oklch(0.94 0.04 60)' },
          200: { value: 'oklch(0.88 0.08 60)' },
          300: { value: 'oklch(0.82 0.12 60)' },
          400: { value: 'oklch(0.79 0.14 60)' },
          500: { value: '#fca311' },
          600: { value: 'oklch(0.68 0.15 60)' },
          700: { value: 'oklch(0.58 0.14 60)' },
          800: { value: 'oklch(0.48 0.12 60)' },
          900: { value: 'oklch(0.38 0.10 60)' },
          950: { value: 'oklch(0.28 0.08 60)' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
