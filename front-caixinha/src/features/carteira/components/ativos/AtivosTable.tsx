import { Fragment, useCallback, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import { KeyboardArrowDown, KeyboardArrowUp, Delete, Edit, ShowChart, Assessment } from '@mui/icons-material'
import { Scrollbar } from '@/components/scrollbar'
import { TipoAtivoChip } from '../shared/TipoAtivoChip'
import { NotaDisplay } from '../shared/NotaDisplay'
import { AtivosTableSkeleton } from '../shared/Skeletons'
import type { AtivoDto, UpdateAtivoPayload } from '../../api/carteira.types'
import toast from 'react-hot-toast'

interface Props {
  ativos: AtivoDto[]
  page: number
  totalElements: number
  pageSize: number
  isLoading: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onUpdate: (payload: UpdateAtivoPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

interface ExpandedRowProps {
  ativo: AtivoDto
  onUpdate: (payload: UpdateAtivoPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: () => void
}

function ExpandedRow({ ativo, onUpdate, onDelete, onClose }: ExpandedRowProps) {
  const [nota, setNota] = useState(String(ativo.nota))
  const [quantidade, setQuantidade] = useState(String(ativo.quantidade))
  const [valor, setValor] = useState(String(ativo.valorAtual))
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdate = async () => {
    setIsSaving(true)
    try {
      await onUpdate({
        identificacao: ativo.id,
        nota: parseInt(nota, 10),
        quantidade: parseFloat(quantidade),
        valor: ativo.tipoAtivo === 'RENDA_FIXA' ? parseFloat(valor) : undefined,
      })
      onClose()
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao atualizar ativo')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTradingView = () => {
    window.open(`https://br.tradingview.com/chart/?symbol=${ativo.nome}`, '_blank')
  }

  const handleFundamentos = () => {
    if (ativo.tipoAtivo !== 'ACAO_NACIONAL' && ativo.tipoAtivo !== 'Ações Nacionais') {
      toast('Disponível apenas para Ações Nacionais')
      return
    }
    window.open(`https://www.fundamentus.com.br/detalhes.php?papel=${ativo.nome}`, '_blank')
  }

  return (
    <Box sx={{ p: 2.5, backgroundColor: 'action.hover' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Editar informações
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Nota (1-10)"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              type="number"
              size="small"
              inputProps={{ min: 1, max: 10 }}
              sx={{ width: 120 }}
            />
            <TextField
              label="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              type="number"
              size="small"
              inputProps={{ min: 0, step: 'any' }}
              sx={{ width: 140 }}
            />
            {ativo.tipoAtivo === 'RENDA_FIXA' && (
              <TextField
                label="Valor atual"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                type="number"
                size="small"
                inputProps={{ min: 0, step: '0.01' }}
                sx={{ width: 140 }}
              />
            )}
          </Stack>
        </Stack>

        <Stack justifyContent="flex-end" spacing={1}>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={handleTradingView} startIcon={<ShowChart fontSize="small" />}>
              TradingView
            </Button>
            <Button size="small" variant="outlined" onClick={handleFundamentos} startIcon={<Assessment fontSize="small" />}>
              Fundamentos
            </Button>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" color="inherit" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleUpdate}
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(ativo.id)}
            >
              Remover
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export function AtivosTable({
  ativos,
  page,
  totalElements,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onUpdate,
  onDelete,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  if (isLoading && !ativos.length) return <AtivosTableSkeleton />

  return (
    <div>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={48} />
              <TableCell>Ativo</TableCell>
              <TableCell width={120}>Nota</TableCell>
              <TableCell width={140}>Tipo</TableCell>
              <TableCell width={100} align="right">Qtd</TableCell>
              <TableCell width={140} align="right">Valor atual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ativos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum ativo encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              ativos.map((ativo) => {
                const isExpanded = ativo.id === expandedId
                return (
                  <Fragment key={ativo.id}>
                    <TableRow
                      hover
                      sx={{
                        cursor: 'pointer',
                        ...(isExpanded && {
                          backgroundColor: 'action.selected',
                          borderLeft: '3px solid',
                          borderColor: 'primary.main',
                        }),
                      }}
                    >
                      <TableCell padding="checkbox">
                        <IconButton size="small" onClick={() => toggle(ativo.id)}>
                          <SvgIcon fontSize="small">
                            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell onClick={() => toggle(ativo.id)}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            src={ativo.image ?? undefined}
                            variant="rounded"
                            sx={{ width: 40, height: 40, backgroundColor: 'action.hover' }}
                          >
                            {ativo.nome[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{ativo.nome}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              R$ {ativo.valorAtual.toFixed(2)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell onClick={() => toggle(ativo.id)}>
                        <NotaDisplay nota={ativo.nota} />
                      </TableCell>
                      <TableCell onClick={() => toggle(ativo.id)}>
                        <TipoAtivoChip tipo={ativo.tipoAtivo} />
                      </TableCell>
                      <TableCell align="right" onClick={() => toggle(ativo.id)}>
                        <Typography variant="body2">{ativo.quantidade}</Typography>
                      </TableCell>
                      <TableCell align="right" onClick={() => toggle(ativo.id)}>
                        <Typography variant="body2" fontWeight={500}>
                          R$ {(ativo.valorAtual * ativo.quantidade).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, borderBottom: isExpanded ? '1px solid' : 0, borderColor: 'divider' }}>
                        <Collapse in={isExpanded} unmountOnExit>
                          <ExpandedRow
                            ativo={ativo}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onClose={() => setExpandedId(null)}
                          />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[5, 10, 20, 50]}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        labelRowsPerPage="Por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </div>
  )
}