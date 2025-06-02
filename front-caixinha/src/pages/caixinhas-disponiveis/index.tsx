import {
  Typography,
  Box,
  Container,
  Pagination,
  Stack,
  Paper
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Caixinha } from '@/types/types'
import { CaixinhaSearch } from '@/components/caixinha/CaixinhaSearch'
import { CaixinhaCard } from '@/components/caixinha/CaixinhaCard'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Unstable_Grid2';
import { getCaixinhas } from '../api/caixinhas'
import { Footer } from '@/components/footer'
import { useTheme } from '@mui/material/styles';

export default function Home() {
  const [data, setData] = useState<Caixinha[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const theme = useTheme()

  useEffect(() => {
    getCaixinhas().then(r => {
      setData(r)
      setLoading(false)
    }).catch(() => {
      router.push('error')
    })
  }, [router])

  const search = useCallback((query: string) => {
    getCaixinhas({ query }).then(r => setData(r))
  }, [])

  if (loading) {
    return <CenteredCircularProgress />
  }

  return (
    <Layout>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          py: { xs: 4, md: 8 },
          background: theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center">
            <Typography variant="h3" fontWeight={700} align="center" gutterBottom>
              Caixinhas disponíveis
            </Typography>
            <Paper elevation={3} sx={{ 
              width: '100%', 
              maxWidth: 600, 
              p: 2, 
              mb: 2, 
              borderRadius: 3,
              background: theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            }}>
              <CaixinhaSearch search={search} />
            </Paper>
            <Paper elevation={1} sx={{ 
              width: '100%', 
              p: { xs: 1, sm: 3 }, 
              borderRadius: 3, 
            }}>
              <Grid
                container
                spacing={{ xs: 3, lg: 4 }}
                justifyContent="center"
              >
                {data.map((caixinha: Caixinha, index: any) => (
                  <Grid
                    key={index}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <CaixinhaCard key={caixinha.id} caixinha={caixinha} />
                  </Grid>
                ))}
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4
                }}
              >
                <Pagination
                  count={1}
                  size="medium"
                  color="primary"
                  shape="rounded"
                />
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>
      <Footer/>
    </Layout>
  )
}