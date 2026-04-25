import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: true, // Garante que o Vite escute em 0.0.0.0 (essencial pro Docker)
    port: 5173,
    allowedHosts: [
      'ec2-56-125-109-199.sa-east-1.compute.amazonaws.com', // O host da sua AWS
      'localhost',
    ],
    // Ou, se quiser liberar pra qualquer host em ambiente de desenvolvimento:
    // allowedHosts: true,

    watch: {
      usePolling: true, // Importante para o Hot Reload funcionar dentro do Docker
    },
  },
});
