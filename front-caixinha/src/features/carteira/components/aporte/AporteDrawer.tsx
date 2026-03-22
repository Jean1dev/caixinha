import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import { Close, AttachMoney, TrendingUp } from '@mui/icons-material'
import { useAporte } from '../../hooks/useAporte'
import { useDistribuicao } from '../../hooks/useDistribuicao'
import type { Carteira } from '../../api/carteira.types'
import { TipoAtivoChip } from '../shared/TipoAtivoChip'
import { formatBRL } from '../shared/ValorMonetario'

interface Props {
  open: boolean
  onClose: () => void
  carteiras: Carteira[]
  defaultCarteiraId?: string
}

export function AporteDrawer({ open, onClose, carteiras, defaultCarteiraId }: Props) {
  const [carteiraId, setCarteiraId] = useState(defaultCarteiraId ?? carteiras[0]?.id ?? '')
  const [valor, setValor] = useState('')
  const { resultado, isLoading, calcular, limpar } = useAporte()
  const { refresh: refreshDistribuicao } = useDistribuicao(carteiraId)

  const handleCalcular = () => {
    if (!carteiraId || !valor) return
    calcular(carteiraId, parseFloat(valor))
  }

  const handleClose = () => {
    limpar()
    setValor('')
    onClose()
  }

  const recomendacoesPositivas = resultado?.recomendacaoAporteList.filter(
    (r) => r.recomendacao > 0
  ) ?? []

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700}>
            Novo Aporte
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Form */}
        <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
          <Stack spacing={2.5}>
            <TextField
              select
              fullWidth
              label="Carteira"
              value={carteiraId}
              onChange={(e) => { setCarteiraId(e.target.value); limpar() }}
              size="small"
            >
              {carteiras.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Valor do aporte"
              value={valor}
              onChange={(e) => { setValor(e.target.value); limpar() }}
              type="number"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder="0,00"
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleCalcular}
              disabled={isLoading || !carteiraId || !valor}
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <TrendingUp />}
            >
              {isLoading ? 'Calculando...' : 'Calcular distribuição'}
            </Button>

            {/* Resultado */}
            {resultado && (
              <Stack spacing={2}>
                <Divider>
                  <Chip label="Recomendações" size="small" />
                </Divider>

                {recomendacoesPositivas.length === 0 ? (
                  <Alert severity="info">
                    Nenhuma recomendação positiva para este valor. Tente um valor maior.
                  </Alert>
                ) : (
                  recomendacoesPositivas.map((item) => (
                    <Box
                      key={`${item.ativo.ticker}-${item.recomendacao}`}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {item.ativo.ticker}
                        </Typography>
                        <TipoAtivoChip tipo={item.ativo.tipoAtivo} />
                      </Stack>
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={700} color="success.main">
                          {formatBRL(item.recomendacao)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          cotação: {formatBRL(item.ativo.valorAtual)}
                        </Typography>
                      </Stack>
                    </Box>
                  ))
                )}

                {resultado.metaComValorRecomendados.length > 0 && (
                  <>
                    <Divider>
                      <Chip label="Por classe de ativo" size="small" />
                    </Divider>
                    {resultado.metaComValorRecomendados
                      .filter((m) => m.valorRecomendado > 0)
                      .map((meta) => (
                        <Box
                          key={meta.tipoAtivo}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            py: 0.5,
                          }}
                        >
                          <TipoAtivoChip tipo={meta.tipoAtivo} />
                          <Typography variant="subtitle2" color="primary.main">
                            {formatBRL(meta.valorRecomendado)}
                          </Typography>
                        </Box>
                      ))}
                  </>
                )}
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}