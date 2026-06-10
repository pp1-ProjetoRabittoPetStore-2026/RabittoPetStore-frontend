import { z } from 'zod';

export const loginSchema = z.object({
  // Back-office aceita e-mail ou CPF como identificador
  email: z.string().min(3, 'Informe seu e-mail ou CPF'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
