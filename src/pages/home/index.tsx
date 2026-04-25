import { Heading, Stack, Text } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Stack gap={4}>
      <Heading>Bem-vindo ao RabittoPetStore</Heading>
      <Text>Você está autenticado.</Text>
    </Stack>
  );
}
