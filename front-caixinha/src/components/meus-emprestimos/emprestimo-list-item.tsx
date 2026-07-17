import { Box, Stack, Typography } from '@mui/material';
import type { EmprestimoView } from '@/features/caixinha/utils/flatten-emprestimos';
import { brl } from '@/features/caixinha/utils/flatten-emprestimos';
import { LoanProgress } from './loan-progress';
import { SoftChip, statusPalette } from './loan-status';

interface Props {
    e: EmprestimoView
    active?: boolean
    onClick: (uid: string) => void
}

export const EmprestimoListItem = ({ e, active, onClick }: Props) => {
    const pct = e.parcelas ? Math.round((e.pagas / e.parcelas) * 100) : 0
    const barColor = `${statusPalette(e.status)}.main`
    return (
        <Box
            onClick={() => onClick(e.uid)}
            sx={{
                p: 2,
                borderRadius: 4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                border: '1px solid',
                borderColor: active ? 'primary.main' : 'divider',
                bgcolor: active ? 'primary.lightest' : 'background.paper',
                transition: 'border-color .15s, background .15s',
                '&:hover': { borderColor: 'primary.light' },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>{e.caixinha}</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 0.25 }}>{brl(e.valor)}</Typography>
                </Box>
                <SoftChip status={e.status} small />
            </Stack>
            <LoanProgress pct={pct} color={barColor as string} />
            <Stack direction="row" justifyContent="space-between" sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                <span>
                    {e.pagas}/{e.parcelas} parcelas
                </span>
                <span>{e.proxima ? `Próxima: ${e.proxima}` : e.status === 'Quitado' ? 'Quitado' : '—'}</span>
            </Stack>
        </Box>
    );
};
