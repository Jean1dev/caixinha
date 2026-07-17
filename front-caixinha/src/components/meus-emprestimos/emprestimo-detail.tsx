import * as React from 'react';
import { Avatar, Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
import Check from '@mui/icons-material/Check';
import Schedule from '@mui/icons-material/Schedule';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import type { EmprestimoView } from '@/features/caixinha/utils/flatten-emprestimos';
import { brl } from '@/features/caixinha/utils/flatten-emprestimos';
import { LoanProgress } from './loan-progress';
import { SoftChip, statusPalette } from './loan-status';

interface Props {
    e: EmprestimoView
    compact?: boolean
    onDetails: (uid: string) => void
    onRenegociar: (uid: string) => void
}

interface ParcelaRow {
    label: string
    valor: number
    paid: boolean
}

function buildParcelas(e: EmprestimoView): ParcelaRow[] {
    if (e.billingDates.length) {
        return e.billingDates.map((b, i) => ({
            label: b.data || `Parcela ${i + 1}`,
            valor: b.valor ?? e.valorParcela,
            paid: b.valor != null,
        }))
    }
    return Array.from({ length: e.parcelas }).map((_, i) => ({
        label: `Parcela ${i + 1}`,
        valor: e.valorParcela,
        paid: i < e.pagas,
    }))
}

export const EmprestimoDetail = ({ e, compact, onDetails, onRenegociar }: Props) => {
    const pct = e.parcelas ? Math.round((e.pagas / e.parcelas) * 100) : 0
    const barColor = `${statusPalette(e.status)}.main`
    const parcelas = buildParcelas(e)
    const resumo: [string, string][] = [
        ['Valor da parcela', brl(e.valorParcela)],
        ['Restante', brl(e.restante)],
        ['Próxima parcela', e.proxima || '—'],
    ]

    return (
        <Card sx={{ p: compact ? 2.5 : 3.5, borderRadius: 5, boxShadow: '0 5px 22px rgba(0,0,0,0.08)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2.5 }}>
                <Box>
                    <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '.5px' }}>
                        {e.caixinha}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: compact ? 24 : 30 }}>{brl(e.valor)}</Typography>
                </Box>
                <SoftChip status={e.status} />
            </Stack>

            <LoanProgress pct={pct} color={barColor as string} />
            <Stack direction="row" justifyContent="space-between" sx={{ fontSize: 13, color: 'text.secondary', mt: 1, mb: 3 }}>
                <span>
                    {e.pagas} de {e.parcelas} parcelas pagas
                </span>
                <span>{pct}%</span>
            </Stack>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2,
                    mb: 3,
                }}
            >
                {resumo.map(([k, v]) => (
                    <Box key={k}>
                        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '.5px' }}>
                            {k}
                        </Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: compact ? 14 : 16, mt: 0.5 }}>{v}</Typography>
                    </Box>
                ))}
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5 }}>Parcelas</Typography>
            <Box sx={{ mb: 3 }}>
                {parcelas.map((p, i) => (
                    <Stack
                        key={i}
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{
                            py: 1,
                            borderBottom: i < parcelas.length - 1 ? '1px solid' : 'none',
                            borderColor: 'divider',
                        }}
                    >
                        <Avatar sx={{ width: 30, height: 30, bgcolor: p.paid ? 'success.lightest' : '#F3F4F6' }}>
                            {p.paid ? (
                                <Check sx={{ fontSize: 16, color: 'success.dark' }} />
                            ) : (
                                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                            )}
                        </Avatar>
                        <Typography sx={{ flex: 1, fontSize: 13.5 }}>{p.label}</Typography>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: p.paid ? 'success.dark' : 'text.secondary' }}>
                            {brl(p.valor)}
                        </Typography>
                    </Stack>
                ))}
            </Box>

            {e.status !== 'Quitado' ? (
                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => onDetails(e.uid)}
                        sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                    >
                        Pagar parcela
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => onRenegociar(e.uid)}
                        sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                    >
                        Renegociar
                    </Button>
                </Stack>
            ) : (
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ReceiptLong />}
                    onClick={() => onDetails(e.uid)}
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                >
                    Ver comprovante
                </Button>
            )}
        </Card>
    );
};
