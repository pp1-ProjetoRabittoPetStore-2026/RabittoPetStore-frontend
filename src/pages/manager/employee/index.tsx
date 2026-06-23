import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isAxiosError } from 'axios';
import { Pencil, Trash2, Plus, ShieldAlert } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  IconButton,
  Dialog,
  Input,
  Field,
  Stack,
  createListCollection,
  HStack,
  Spinner,
} from '@chakra-ui/react';

import {
  useCreateEmployee,
  useDeactivateEmployee,
  useEmployees,
  useUpdateEmployee,
} from '@/services/employee/queries';
import {
  ROLE_PERMISSIONS,
  type Employee,
  type Role,
} from '@/services/employee/types';
import { tokens } from '@/styles/tokens';
import { MaskedInput } from '@/components/ui/masked-input';
import { MASKS } from '@/components/ui/mask-presets';



const employeeSchema = z
  .object({
    nome: z.string().min(2, 'Nome muito curto'),
    cargo: z.string().min(1, 'Selecione um cargo'),
    cpf: z.string().min(11, 'CPF inválido'),
    email: z
      .string()
      .email('E-mail inválido')
      .optional()
      .or(z.literal('')),
    telefone: z.string().min(8, 'Telefone inválido'),
    senha: z.string().optional(),
    confirmarSenha: z.string().optional(),
  })
  

  .refine((d) => !d.senha || d.senha === d.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
  });

type EmployeeFormData = z.infer<typeof employeeSchema>;





function getApiErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (isAxiosError(error)) {
    const apiError = error.response?.data?.error;
    if (typeof apiError === 'string' && apiError.trim()) return apiError;
    if (!error.response) return 'Não foi possível conectar ao servidor.';
  }
  return 'Não foi possível salvar o funcionário. Tente novamente.';
}

const roles = createListCollection({
  items: [
    { label: 'Gerente', value: 'GERENTE' },
    { label: 'Caixa', value: 'CAIXA' },
    { label: 'Tosador', value: 'TOSADOR' },
    { label: 'Veterinário', value: 'VETERINARIO' },
  ],
});

export default function EmployeePage() {
  const { data: employees, isLoading } = useEmployees();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deactivateMutation = useDeactivateEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const selectedRole = useWatch({ control, name: 'cargo' }) as Role;
  const submitError = getApiErrorMessage(
    createMutation.error ?? updateMutation.error,
  );

  const openCreateModal = () => {
    setEditingEmployee(null);
    reset({
      nome: '',
      cargo: '',
      cpf: '',
      email: '',
      telefone: '',
      senha: '',
      confirmarSenha: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    reset({
      nome: emp.nome,
      cargo: emp.cargo,
      cpf: emp.cpf,
      email: emp.email ?? '',
      telefone: emp.telefone,
      senha: '',
      confirmarSenha: '',
    });
    setIsModalOpen(true);
  };

  

  const onSubmit = ({ confirmarSenha: _, ...data }: EmployeeFormData) => {
    if (editingEmployee) {
      updateMutation.mutate(
        {
          id: editingEmployee.id!,
          data: { ...data, ativo: editingEmployee.ativo },
        },
        {
          onSuccess: () => setIsModalOpen(false),
        },
      );
      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  return (
    <Box p="8">
      <Helmet>
        <title>Rabitto Pet Store — Funcionários</title>
      </Helmet>
      <Flex justify="space-between" align="center" mb="8">
        <Box>
          <Heading size="2xl" color={tokens.textPrimary}>
            Equipe & Acessos
          </Heading>
          <Text color={tokens.textMuted} mt={1}>
            Gerencie funcionários, cargos e permissões do sistema.
          </Text>
        </Box>
        <Button colorPalette="blue" onClick={openCreateModal} gap="2">
          <Plus size={18} /> Novo Funcionário
        </Button>
      </Flex>

      {}
      <Box
        rounded="xl"
        overflow="hidden"
        bg={tokens.panelBg}
        borderWidth="1px"
        borderColor={tokens.panelBorder}
        color={tokens.textPrimary}
      >
        <Table.ScrollArea h="600px">
          <Table.Root
            size="md"
            stickyHeader
            bg="transparent"
            css={{
              '& td, & th': { bg: 'transparent', borderColor: tokens.panelBorder },
              '& tbody tr': { bg: 'transparent' },
              '& tbody tr:hover': { bg: tokens.panelBorder },
            }}
          >
            <Table.Header>
              <Table.Row bg={tokens.panelBorder}>
                <Table.ColumnHeader color={tokens.textMuted}>Nome</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Cargo</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>CPF</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Status</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted} textAlign="end">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center" py="10">
                    <Spinner />
                  </Table.Cell>
                </Table.Row>
              ) : (
                employees?.map((emp) => (
                  <Table.Row key={emp.id} opacity={emp.ativo ? 1 : 0.6}>
                    <Table.Cell>
                      <HStack gap="3">
                        <Box
                          w="9"
                          h="9"
                          rounded="full"
                          bg={tokens.accent}
                          color="white"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          {emp.nome.charAt(0).toUpperCase()}
                        </Box>
                        <Text fontWeight="medium">{emp.nome}</Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant="subtle"
                        colorPalette={getRoleColor(emp.cargo)}
                      >
                        {emp.cargo}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{emp.cpf}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant="solid"
                        colorPalette={emp.ativo ? 'green' : 'red'}
                      >
                        {emp.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <HStack gap="2" justify="flex-end">
                        <IconButton
                          variant="ghost"
                          colorPalette="blue"
                          onClick={() => openEditModal(emp)}
                        >
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          colorPalette="red"
                          disabled={!emp.ativo}
                          onClick={() => deactivateMutation.mutate(emp.id!)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>

      {}
      <Dialog.Root
        open={isModalOpen}
        onOpenChange={(e) => setIsModalOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="2xl" p="6">
            <Dialog.Header>
              <Dialog.Title fontSize="xl">
                {editingEmployee ? 'Editar Perfil' : 'Cadastrar Funcionário'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form id="employee-form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4">
                  {submitError && (
                    <Alert.Root status="error" borderRadius="md">
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Title>{submitError}</Alert.Title>
                      </Alert.Content>
                    </Alert.Root>
                  )}

                  <Field.Root invalid={!!errors.nome}>
                    <Field.Label>Nome Completo</Field.Label>
                    <Input
                      {...register('nome')}
                      placeholder="Ex: Maria Oliveira"
                    />
                    <Field.ErrorText>{errors.nome?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.cargo}>
                    <Field.Label>Cargo</Field.Label>
                    <select
                      {...register('cargo')}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                      }}
                    >
                      <option value="">Selecione o cargo</option>
                      {roles.items.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <Field.ErrorText>{errors.cargo?.message}</Field.ErrorText>
                  </Field.Root>

                  {selectedRole && ROLE_PERMISSIONS[selectedRole] && (
                    <Box p="3" rounded="md">
                      <HStack
                        color="blue.700"
                        mb="2"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        <ShieldAlert size={14} /> <Text>PERMISSÕES:</Text>
                      </HStack>
                      <HStack flexWrap="wrap" gap="1">
                        {ROLE_PERMISSIONS[selectedRole].map((perm) => (
                          <Badge key={perm} size="sm" variant="outline">
                            {perm}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}

                  <HStack gap="4">
                    <Field.Root invalid={!!errors.cpf}>
                      <Field.Label>CPF</Field.Label>
                      <MaskedInput
                        {...register('cpf')}
                        {...MASKS.cpf}
                        placeholder="000.000.000-00"
                      />
                    </Field.Root>
                    <Field.Root invalid={!!errors.telefone}>
                      <Field.Label>Telefone</Field.Label>
                      <MaskedInput
                        {...register('telefone')}
                        {...MASKS.telefone}
                        placeholder="(81) 99999-9999"
                      />
                    </Field.Root>
                  </HStack>

                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>E-mail de acesso</Field.Label>
                    <Input
                      type="email"
                      {...register('email')}
                      placeholder="funcionario@rabitto.com"
                    />
                    <Field.HelperText fontSize="xs">
                      Usado para login no painel
                    </Field.HelperText>
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.senha}>
                    <Field.Label>
                      Senha {editingEmployee && '(Opcional)'}
                    </Field.Label>
                    <Input type="password" {...register('senha')} />
                    <Field.HelperText fontSize="xs">
                      {editingEmployee
                        ? 'Deixe vazio para manter'
                        : 'Senha de acesso inicial'}
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.confirmarSenha}>
                    <Field.Label>Confirmar Senha</Field.Label>
                    <Input type="password" {...register('confirmarSenha')} />
                    <Field.ErrorText>
                      {errors.confirmarSenha?.message}
                    </Field.ErrorText>
                  </Field.Root>
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer mt="6">
              <Dialog.CloseTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.CloseTrigger>
              <Button
                type="submit"
                form="employee-form"
                colorPalette="blue"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                Salvar Funcionário
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}



const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    GERENTE: 'purple',
    CAIXA: 'blue',
    VETERINARIO: 'green',
    TOSADOR: 'orange',
  };
  return colors[role] || 'gray';
};
