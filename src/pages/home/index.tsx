import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useLogout } from '../../services/auth/queries';
import { authService } from '../../services/auth/storage';

export default function HomePage() {
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout();

  function handleLogout() {
    logout(undefined, {
      onSettled: () => {
        authService.removeToken();
        navigate('/login', { replace: true });
      },
    });
  }

  return (
    <Stack gap={4} p={8}>
      <Heading>Bem-vindo ao RabittoPetStore</Heading>
      <Text>Você está autenticado.</Text>
      <Button onClick={handleLogout} loading={isPending} w="fit-content">
        Sair
      </Button>
    </Stack>
  );
}
