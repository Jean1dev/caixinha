import { useState, useCallback, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Close } from '@mui/icons-material'
import { useTipoAtivos } from '../../hooks/useTipoAtivos'
import { getListaSugestao } from '../../api/carteira.api'
import type { AtivoDto, Carteira, CreateAtivoPayload } from '../../api/carteira.types'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  carteiras: Carteira[]
  defaultCarteiraId?: string
  ativo?: AtivoDto | null
  onSave: (payload: CreateAtivoPayload) => Promise<void>
}

export function AtivoFormDrawer({ open, onClose, carteiras, defaultCarteiraId, ativo, onSave }: Props) {
  const { tipoAtivos } = useTipoAtivos()
  const [isSaving, setIsSaving] = useState(false)
  const [sugestoes, setSugestoes] = useState<string[]>([])
  const [form, setForm] = useState<any>({
    identificacaoCarteira: defaultCarteiraId ?? carteiras[0]?.id ?? '',
    tipoAtivo: '',
    nome: '',
    quantidade: '',
    nota: '',
    valorAtual: '',
  })

  useEffect(() => {
    if (ativo) {
      setForm({
        identificacaoCarteira: ativo.carteira,
        tipoAtivo: ativo.tipoAtivo,
        nome: ativo.nome,
        quantidade: ativo.quantidade,
        nota: ativo.nota,
        valorAtual: ativo.valorAtual,
      })
    } else {
      setForm({
        identificacaoCarteira: defaultCarteiraId ?? carteiras[0]?.id ?? '',
        tipoAtivo: '',
        nome: '',
        quantidade: '',
        nota: '',
        valorAtual: '',
      })
    }
  }, [ativo, open, defaultCarteiraId, carteiras])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: value }))

    if (name === 'nome' && value.length >= 2) {
      getListaSugestao({ query: value, crypto: form.tipoAtivo === 'CRYPTO' })
        .then(setSugestoes)
        .catch(() => {})
    }
  }, [form])

  const handleSubmit = async () => {
    if (!form.tipoAtivo || !form.nome || !form.quantidade || !form.nota) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    setIsSaving(true)
    try {
      await onSave({
        tipoAtivo: form.tipoAtivo,
        nome: form.nome,
        quantidade: parseFloat(form.quantidade),
        nota: parseInt(form.nota, 10),
        identificacaoCarteira: form.identificacaoCarteira,
        valorAtual: form.tipoAtivo === 'RENDA_FIXA' ? parseFloat(form.valorAtual) : undefined,
      })
      onClose()
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao salvar ativo')
    } finally {
      setIsSaving(false)
    }
  }

  const isEdit = !!ativo

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 440 } } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? 'Editar Ativo' : 'Adicionar Ativo'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: 2.5, overflowY: 'auto', flex: 1 }}>
          <Stack spacing={2.5}>
            <TextField
              select
              fullWidth
              label="Carteira"
              name="identificacaoCarteira"
              value={form.identificacaoCarteira}
              onChange={handleChange}
              size="small"
              disabled={isEdit}
            >
              {carteiras.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Tipo de ativo *"
              name="tipoAtivo"
              value={form.tipoAtivo}
              onChange={handleChange}
              size="small"
              disabled={isEdit}
            >
              {tipoAtivos.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>

            {form.tipoAtivo && (
              <>
                <Divider />

                <Autocomplete
                  freeSolo
                  options={sugestoes}
                  value={form.nome}
                  onChange={(_, value) => setForm((prev: any) => ({ ...prev, nome: value ?? '' }))}
                  disabled={isEdit}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Ticker / Nome *"
                      name="nome"
                      onChange={handleChange}
                      size="small"
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label="Quantidade *"
                  name="quantidade"
                  value={form.quantidade}
                  onChange={handleChange}
                  type="number"
                  size="small"
                  inputProps={{ min: 0, step: 'any' }}
                />

                {form.tipoAtivo === 'RENDA_FIXA' && (
                  <TextField
                    fullWidth
                    label="Valor atual (R$) *"
                    name="valorAtual"
                    value={form.valorAtual}
                    onChange={handleChange}
                    type="number"
                    size="small"
                    inputProps={{ min: 0, step: '0.01' }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Nota (1–10) *"
                  name="nota"
                  value={form.nota}
                  onChange={handleChange}
                  type="number"
                  size="small"
                  inputProps={{ min: 1, max: 10 }}
                  helperText="Sua avaliação pessoal do ativo (1 = pior, 10 = melhor)"
                />
              </>
            )}
          </Stack>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSaving || !form.tipoAtivo || !form.nome}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSaving ? 'Salvando...' : isEdit ? 'Atualizar' : 'Adicionar'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}