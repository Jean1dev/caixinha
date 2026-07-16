import { Box } from '@mui/material';

export const LoanProgress = ({ pct, color }: { pct: number; color: string }) => (
    <Box sx={{ height: 8, borderRadius: 999, bgcolor: '#E5E7EB', overflow: 'hidden' }}>
        <Box
            sx={{
                width: `${Math.min(Math.max(pct, 0), 100)}%`,
                height: '100%',
                bgcolor: color,
                borderRadius: 999,
                transition: 'width .3s',
            }}
        />
    </Box>
);
