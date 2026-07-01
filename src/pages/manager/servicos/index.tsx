import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isAxiosError } from 'axios';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Table,
  IconButton,
  Dialog,
  Input,
  Field,
  Stack,
  HStack,
  Spinner,
} from '@chakra-ui/react';

import {
  useCreateServico,
  useDeleteServico,
  useServicos,
  useUpdateServico,
} from '@/services/servicos/queries';
import type { Servico } from '@/services/servicos/types';
import { tokens } from '@/styles/tokens';

const servicoSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  descricao: z.string().optional(),
  preco: z.number({ message: 'Preço inválido' }).min(0, 'Preço inválido'),
  duracaoMinutos: z
    .number({ message: 'Duração inválida' })
    .int('Informe minutos inteiros')
    .min(1, 'Duração inválida'),
});

type ServicoFormData = z.infer<typeof servicoSchema>;

function getApiErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (isAxiosError(error)) {
    const apiError = error.response?.data?.error;
    if (typeof apiError === 'string' && apiError.trim()) return apiError;
    if (!error.response) return 'Não foi possível conectar ao servidor.';
  }
  return 'Não foi possível salvar o serviço. Tente novamente.';
}

const brl = (v?: number) =>
  typeof v === 'number'
    ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';

export default function ServicosPage() {
  const { data: servicos, isLoading } = useServicos();
  const createMutation = useCreateServico();
  const updateMutation = useUpdateServico();
  const deleteMutation = useDeleteServico();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServicoFormData>({
    resolver: zodResolver(servicoSchema),
  });

  const submitError = getApiErrorMessage(
    createMutation.error ?? updateMutation.error,
  );

  const openCreateModal = () => {
    setEditing(null);
    reset({ nome: '', descricao: '', preco: 0, duracaoMinutos: 30 });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Servico) => {
    setEditing(s);
    reset({
      nome: s.nome,
      descricao: s.descricao ?? '',
      preco: s.preco,
      duracaoMinutos: s.duracaoMinutos,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: ServicoFormData) => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id!, data },
        { onSuccess: () => setIsModalOpen(false) },
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
        <title>Rabitto Pet Store — Serviços</title>
      </Helmet>
      <Flex justify="space-between" align="center" mb="8">
        <Box>
          <Heading size="2xl" color={tokens.textPrimary}>
            Serviços
          </Heading>
          <Text color={tokens.textMuted} mt={1}>
            Cadastre banho, tosa, veterinário e outros serviços oferecidos.
          </Text>
        </Box>
        <Button colorPalette="blue" onClick={openCreateModal} gap="2">
          <Plus size={18} /> Novo Serviço
        </Button>
      </Flex>

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
                <Table.ColumnHeader color={tokens.textMuted}>Descrição</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Preço</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Duração</Table.ColumnHeader>
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
              ) : servicos && servicos.length > 0 ? (
                servicos.map((s) => (
                  <Table.Row key={s.id}>
                    <Table.Cell>
                      <Text fontWeight="medium">{s.nome}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color={tokens.textMuted}>{s.descricao || '—'}</Text>
                    </Table.Cell>
                    <Table.Cell>{brl(s.preco)}</Table.Cell>
                    <Table.Cell>{s.duracaoMinutos} min</Table.Cell>
                    <Table.Cell textAlign="end">
                      <HStack gap="2" justify="flex-end">
                        <IconButton
                          variant="ghost"
                          colorPalette="blue"
                          onClick={() => openEditModal(s)}
                        >
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => deleteMutation.mutate(s.id!)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center" py="10" color={tokens.textMuted}>
                    Nenhum serviço cadastrado.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>

      <Dialog.Root open={isModalOpen} onOpenChange={(e) => setIsModalOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="2xl" p="6">
            <Dialog.Header>
              <Dialog.Title fontSize="xl">
                {editing ? 'Editar Serviço' : 'Cadastrar Serviço'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form id="servico-form" onSubmit={handleSubmit(onSubmit)}>
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
                    <Field.Label>Nome</Field.Label>
                    <Input {...register('nome')} placeholder="Ex: Banho, Tosa, Veterinário" />
                    <Field.ErrorText>{errors.nome?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.descricao}>
                    <Field.Label>Descrição</Field.Label>
                    <Input {...register('descricao')} placeholder="Detalhes do serviço" />
                    <Field.ErrorText>{errors.descricao?.message}</Field.ErrorText>
                  </Field.Root>

                  <HStack gap="4">
                    <Field.Root invalid={!!errors.preco}>
                      <Field.Label>Preço (R$)</Field.Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register('preco', { valueAsNumber: true })}
                        placeholder="0,00"
                      />
                      <Field.ErrorText>{errors.preco?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.duracaoMinutos}>
                      <Field.Label>Duração (min)</Field.Label>
                      <Input
                        type="number"
                        min="1"
                        {...register('duracaoMinutos', { valueAsNumber: true })}
                        placeholder="30"
                      />
                      <Field.ErrorText>{errors.duracaoMinutos?.message}</Field.ErrorText>
                    </Field.Root>
                  </HStack>
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer mt="6">
              <Dialog.CloseTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.CloseTrigger>
              <Button
                type="submit"
                form="servico-form"
                colorPalette="blue"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                Salvar Serviço
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
