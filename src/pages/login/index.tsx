import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from './schema/login.schema';
import { useLogin } from '../../services/auth/queries';
import { authService } from '../../services/auth/storage';
import { tokens } from '../../styles/tokens';

const inputStyles = {
  bg: tokens.inputBg,
  color: tokens.textPrimary,
  borderColor: tokens.inputBorder,
  _focusVisible: {
    borderColor: tokens.accent,
    boxShadow: `0 0 0 3px ${tokens.accentGlow}`,
  },
  _placeholder: { color: 'oklch(0.58 0.04 80)' },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    <Flex
      position="fixed"
      inset="0"
      zIndex="50"
      direction={{ base: 'column', md: 'row' }}
      fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    >
      {/* Brand column */}
      <Flex
        w={{ base: 'full', md: '42%' }}
        bg={tokens.panelBg}
        p={{ base: '5', md: '12' }}
        direction={{ base: 'row', md: 'column' }}
        justify={{ base: 'flex-start', md: 'space-between' }}
        align={{ base: 'center', md: 'stretch' }}
        gap={{ base: '4', md: '0' }}
        borderBottom={{ base: '1px solid', md: 'none' }}
        borderRight={{ base: 'none', md: '1px solid' }}
        borderColor={tokens.panelBorder}
        position="relative"
        overflow="hidden"
      >
        {/* Ambient glow */}
        <Box
          display={{ base: 'none', md: 'block' }}
          position="absolute"
          bottom="-80px"
          right="-80px"
          w="320px"
          h="320px"
          background="radial-gradient(circle, oklch(0.73 0.08 65 / 0.10) 0%, transparent 70%)"
          pointerEvents="none"
        />

        {/* Paw */}
        <Text
          fontSize={{ base: '28px', md: '36px' }}
          lineHeight="1"
          userSelect="none"
          filter="drop-shadow(0 0 16px oklch(0.73 0.08 65 / 0.45))"
        >
          🐾
        </Text>

        {/* Wordmark */}
        <Flex
          flex={{ md: '1' }}
          direction={{ base: 'row', md: 'column' }}
          align={{ base: 'baseline', md: 'flex-start' }}
          justify={{ base: 'flex-start', md: 'center' }}
          gap={{ base: '2', md: '0' }}
        >
          <Text
            as="span"
            fontSize={{ base: '26px', md: 'clamp(48px, 5.5vw, 78px)' }}
            fontWeight="800"
            color={tokens.textPrimary}
            letterSpacing={{ base: '-0.5px', md: '-2.5px' }}
            lineHeight={{ base: '1', md: '0.88' }}
            mb={{ base: '0', md: '3' }}
          >
            Rabitto
          </Text>
          <Text
            as="span"
            fontSize={{ base: '13px', md: '17px' }}
            fontWeight="600"
            color="brand.500"
            mb={{ base: '0', md: '4' }}
          >
            Pet Store
          </Text>
          <Text
            display={{ base: 'none', md: 'block' }}
            fontSize="10px"
            fontWeight="500"
            letterSpacing="3px"
            textTransform="uppercase"
            color={tokens.textMuted}
          >
            Sistema de Gestão
          </Text>
        </Flex>

        {/* Gold rule */}
        <Box
          display={{ base: 'none', md: 'block' }}
          w="40px"
          h="3px"
          bg="brand.500"
          borderRadius="full"
        />
      </Flex>

      {/* Form column */}
      <Flex
        flex="1"
        bg={tokens.pageBg}
        align="center"
        justify="center"
        p={{ base: '8', md: '12' }}
      >
        <Stack w="full" maxW="380px" gap="0">
          <Heading
            fontSize={{ base: '22px', md: '26px' }}
            fontWeight="700"
            color={tokens.textPrimary}
            letterSpacing="-0.5px"
            mb="2"
          >
            Acesse o painel
          </Heading>
          <Text fontSize="sm" color={tokens.textMuted} mb="10">
            Use suas credenciais administrativas.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap="5">
              <Field.Root invalid={!!errors.email}>
                <Field.Label
                  fontSize="xs"
                  fontWeight="500"
                  color={tokens.textMuted}
                  letterSpacing="0.3px"
                >
                  E-mail ou CPF
                </Field.Label>
                <Input
                  type="text"
                  placeholder="seu@email.com ou CPF"
                  autoComplete="username"
                  {...inputStyles}
                  {...register('email')}
                />
                {errors.email && (
                  <Field.ErrorText fontSize="xs" color={tokens.errorText}>
                    {errors.email.message}
                  </Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.senha}>
                <Field.Label
                  fontSize="xs"
                  fontWeight="500"
                  color={tokens.textMuted}
                  letterSpacing="0.3px"
                >
                  Senha
                </Field.Label>
                <Box position="relative" w="full">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    autoComplete="current-password"
                    pr="11"
                    {...inputStyles}
                    {...register('senha')}
                  />
                  <IconButton
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    variant="ghost"
                    size="sm"
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                    color={tokens.textMuted}
                    _hover={{ color: tokens.textPrimary, bg: 'transparent' }}
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </Box>
                {errors.senha && (
                  <Field.ErrorText fontSize="xs" color={tokens.errorText}>
                    {errors.senha.message}
                  </Field.ErrorText>
                )}
              </Field.Root>

              {error && (
                <Box
                  bg={tokens.errorSurface}
                  border="1px solid"
                  borderColor={tokens.errorBorder}
                  borderRadius="md"
                  px="4"
                  py="3"
                  fontSize="sm"
                  color={tokens.errorText}
                  lineHeight="1.4"
                >
                  Credenciais inválidas. Tente novamente.
                </Box>
              )}

              <Button
                type="submit"
                colorPalette="brand"
                w="full"
                size="lg"
                loading={isPending}
                loadingText="Entrando..."
                color="black"
                fontWeight="700"
                mt="2"
              >
                Entrar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </Flex>
  );
}
