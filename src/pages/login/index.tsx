import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Field, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { loginSchema, type LoginFormData } from './schema/login.schema';
import { useLogin } from '../../services/auth/queries';
import { authService } from '../../services/auth/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  function onSubmit(data: LoginFormData) {
    login(data, {
      onSuccess: (response) => {
        authService.setToken(response.accessToken);
        navigate('/', { replace: true });
      },
    });
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="sm" p={8} borderWidth={1} borderRadius="lg">
        <Stack gap={6} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Heading size="lg" textAlign="center">Entrar</Heading>

          <Field.Root invalid={!!errors.email}>
            <Field.Label>E-mail</Field.Label>
            <Input type="email" placeholder="seu@email.com" {...register('email')} />
            {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Senha</Field.Label>
            <Input type="password" placeholder="••••••" {...register('password')} />
            {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
          </Field.Root>

          {error && (
            <Text color="red.500" fontSize="sm">
              Credenciais inválidas. Tente novamente.
            </Text>
          )}

          <Button type="submit" colorScheme="blue" loading={isPending} w="full">
            Entrar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
