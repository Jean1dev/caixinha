import { Box } from '@mui/material';
import type { LoanStatus } from '@/features/caixinha/utils/flatten-emprestimos';

// palette key per status (uses Devias palette shades: main / lightest)
const PALETTE: Record<LoanStatus, 'warning' | 'success' | 'primary'> = {
    Pendente: 'warning',
    'Em dia': 'success',
    Quitado: 'primary',
}

export const statusPalette = (status: LoanStatus) => PALETTE[status]

// Soft (tinted) status chip matching the indigo design language.
export const SoftChip = ({ status, small }: { status: LoanStatus; small?: boolean }) => {
    const key = PALETTE[status]
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                bgcolor: `${key}.lightest`,
                color: `${key}.dark`,
                fontWeight: 600,
                fontSize: small ? 11 : 13,
                borderRadius: 999,
                px: small ? 1.1 : 1.5,
                py: small ? 0.25 : 0.6,
                whiteSpace: 'nowrap',
                lineHeight: 1.4,
            }}
        >
            {status}
        </Box>
    );
};
