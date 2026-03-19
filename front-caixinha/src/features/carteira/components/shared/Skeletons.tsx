import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

export function DashboardSkeleton() {
  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Card sx={{ flex: '1 1 260px' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto', mt: 2 }} />
        </CardContent>
      </Card>
      <Card sx={{ flex: '1 1 260px' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={28} />
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {[1, 2, 3].map((i) => (
              <Stack key={i} direction="row" alignItems="center" spacing={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="50%" />
                  <Skeleton variant="text" width="30%" />
                </Box>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export function AtivosTableSkeleton() {
  return (
    <Stack spacing={0}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 1, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="25%" />
          </Box>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="text" width={60} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      ))}
    </Stack>
  )
}

export function CotacoesSkeleton() {
  return (
    <Stack direction="row" spacing={2} sx={{ overflow: 'hidden', py: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} variant="rounded" width={100} height={28} sx={{ flexShrink: 0 }} />
      ))}
    </Stack>
  )
}
