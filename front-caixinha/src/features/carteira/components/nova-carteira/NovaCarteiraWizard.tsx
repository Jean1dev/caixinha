import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { criarNovaCarteira, getMetaPronta } from '../../api/carteira.api'
import { useTipoAtivos } from '../../hooks/useTipoAtivos'
import { invalidateCarteiras } from '../../hooks/useCarteiras'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'carteira-wizard-draft'

const STEPS = ['Informações básicas', 'Perfil de investimento', 'Revisar e criar']

const PERFIS = [
  { value: 'CONSERVADOR', label: 'Conservador', desc: 'Prioridade em segurança. Maior parte em renda fixa.' },
  { value: 'MODERADO',    label: 'Moderado',    desc: 'Equilíbrio entre segurança e crescimento.' },
  { value: 'DINAMICO',    label: 'Dinâmico',    desc: 'Mais exposição a renda variável com diversificação.' },
  { value: 'ARROJADO',    label: 'Arrojado',    desc: 'Aceita riscos maiores em busca de retornos altos.' },
  { value: 'SOFISTICADO', label: 'Sofisticado', desc: 'Investidor experiente com ativos globais e alternativos.' },
]

interface Draft {
  nome: string
  perfil: string
  metas: { tipoAtivo: string; percentual: number }[]
}

const EMPTY_DRAFT: Draft = { nome: '', perfil: '', metas: [] }

export function NovaCarteiraWizard() {
  const router = useRouter()
  const { tipoAtivos } = useTipoAtivos()
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMeta, setIsLoadingMeta] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => {
    if (typeof window === 'undefined') return EMPTY_DRAFT
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : EMPTY_DRAFT
    } catch {
      return EMPTY_DRAFT
    }
  })

  // Persist draft on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {}
  }, [draft])

  const selectPerfil = useCallback(async (perfil: string) => {
    setDraft((prev) => ({ ...prev, perfil, metas: [] }))
    if (!perfil) return

    setIsLoadingMeta(true)
    try {
      const res = await getMetaPronta(perfil)
      const metas = res.map((item: any) => ({
        tipoAtivo: item.tipoAtivo,
        percentual: item.percentual,
      }))
      setDraft((prev) => ({ ...prev, metas }))
    } catch {
      toast.error('Não foi possível carregar as metas para esse perfil')
    } finally {
      setIsLoadingMeta(false)
    }
  }, [])

  const canProceed = () => {
    if (step === 0) return draft.nome.trim().length >= 2
    return true
  }

  const handleCreate = async () => {
    setIsLoading(true)
    try {
      await criarNovaCarteira({
        nome: draft.nome,
        metaDefinida: draft.perfil ? draft.perfil : undefined,
        ativos: []
      })
      localStorage.removeItem(STORAGE_KEY)
      invalidateCarteiras()
      toast.success('Carteira criada com sucesso!')
      router.push('/carteira')
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao criar carteira')
    } finally {
      setIsLoading(false)
    }
  }

  const tipoLabel = (tipo: string) =>
    tipoAtivos.find((t) => t.value === tipo)?.label ?? tipo

  return (
    <Box>
      {/* Stepper */}
      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Progress */}
      <LinearProgress
        variant="determinate"
        value={((step + 1) / STEPS.length) * 100}
        sx={{ mb: 3, height: 4, borderRadius: 2 }}
      />

      {/* Step 0: Nome */}
      {step === 0 && (
        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Como você quer chamar sua carteira?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Escolha um nome que te ajude a identificar o objetivo desta carteira.
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Nome da carteira *"
                value={draft.nome}
                onChange={(e) => setDraft((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Aposentadoria, Reserva de emergência..."
                helperText={`${draft.nome.length}/50 caracteres`}
                inputProps={{ maxLength: 50 }}
                autoFocus
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Perfil */}
      {step === 1 && (
        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Escolha seu perfil de investimento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Opcional — você pode pular e definir as metas manualmente depois.
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                {PERFIS.map((perfil) => (
                  <Paper
                    key={perfil.value}
                    variant="outlined"
                    onClick={() => selectPerfil(draft.perfil === perfil.value ? '' : perfil.value)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderColor: draft.perfil === perfil.value ? 'primary.main' : 'divider',
                      borderWidth: draft.perfil === perfil.value ? 2 : 1,
                      backgroundColor: draft.perfil === perfil.value ? 'primary.alpha4' : 'transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': { borderColor: 'primary.light', backgroundColor: 'action.hover' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {perfil.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {perfil.desc}
                        </Typography>
                      </Box>
                      {draft.perfil === perfil.value && (
                        <Check color="primary" />
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Stack>

              {isLoadingMeta && (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">Carregando metas...</Typography>
                </Stack>
              )}

              {draft.metas.length > 0 && !isLoadingMeta && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Distribuição sugerida
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {draft.metas.map((meta) => (
                      <Chip
                        key={meta.tipoAtivo}
                        label={`${tipoLabel(meta.tipoAtivo)}: ${meta.percentual}%`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Revisão */}
      {step === 2 && (
        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Typography variant="h6">Revisar e criar</Typography>

              <Box>
                <Typography variant="caption" color="text.secondary">Nome da carteira</Typography>
                <Typography variant="subtitle1" fontWeight={700}>{draft.nome}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">Perfil de investimento</Typography>
                <Typography variant="subtitle1">
                  {draft.perfil
                    ? PERFIS.find((p) => p.value === draft.perfil)?.label ?? draft.perfil
                    : <span style={{ color: '#9e9e9e' }}>Não definido</span>
                  }
                </Typography>
              </Box>

              {draft.metas.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                      Distribuição por classe
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {draft.metas.map((meta) => (
                        <Chip
                          key={meta.tipoAtivo}
                          label={`${tipoLabel(meta.tipoAtivo)}: ${meta.percentual}%`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                </>
              )}

              <Alert severity="info" variant="outlined">
                Você poderá adicionar ativos e ajustar as metas após criar a carteira.
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBack />}
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Anterior
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Próximo
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleCreate}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <Check />}
          >
            {isLoading ? 'Criando...' : 'Criar carteira'}
          </Button>
        )}
      </Stack>
    </Box>
  )
}
