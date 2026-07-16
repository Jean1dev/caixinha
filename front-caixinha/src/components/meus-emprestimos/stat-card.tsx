import * as React from 'react';
import { Avatar, Box, Card, Stack, Typography } from '@mui/material';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import type { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
    over: string
    value: string
    Icon: SvgIconComponent
    delta?: number
    positive?: boolean
    caption?: string
}

export const StatCard = ({ over, value, Icon, delta, positive = true, caption }: StatCardProps) => (
    <Card
        sx={{
            p: 3,
            borderRadius: 5,
            boxShadow: '0 5px 22px rgba(0,0,0,0.08)',
        }}
    >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
            <Box>
                <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', letterSpacing: '.5px' }}
                >
                    {over}
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 30, mt: 0.5, lineHeight: 1.1 }}>
                    {value}
                </Typography>
            </Box>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                <Icon sx={{ fontSize: 26, color: '#fff' }} />
            </Avatar>
        </Stack>
        {delta != null && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.25}
                    sx={{ color: positive ? 'success.main' : 'error.main', fontSize: 14 }}
                >
                    {positive ? (
                        <ArrowUpward sx={{ fontSize: 18 }} />
                    ) : (
                        <ArrowDownward sx={{ fontSize: 18 }} />
                    )}
                    <span>{delta}%</span>
                </Stack>
                {caption && (
                    <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>{caption}</Typography>
                )}
            </Stack>
        )}
    </Card>
);
