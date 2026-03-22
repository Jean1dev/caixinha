import {
  Typography,
  Box,
  Container,
  Pagination,
  Stack,
  Paper
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Layout from '@/components/Layout'
import { Caixinha } from '@/types/types'
import { CaixinhaSearch } from '@/components/caixinha/CaixinhaSearch'
import { CaixinhaCard } from '@/components/caixinha/CaixinhaCard'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Unstable_Grid2';
import { Footer } from '@/components/footer'
import { useTheme } from '@mui/material/styles';
import { useCaixinhasCatalog } from '@/features/caixinha/hooks/useCaixinhasCatalog'
import { filterCaixinhasByQuery } from '@/features/caixinha/api/caixinha.api'
const PAGE_SIZE = 6

export default function Home() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const router = useRouter()
  const theme = useTheme()
  const { catalog, isLoading, error } = useCaixinhasCatalog()

  const data = useMemo(() => filterCaixinhasByQuery(catalog, query), [catalog, query])

  useEffect(() => {
    setPage(1)
  }, [query])

  const pageCount = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const paged = useMemo(
    () => data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [data, page]
  )

  useEffect(() => {
    if (error) {
      router.push('/error')
    }
  }, [error, router])

  const search = useCallback((q: string) => {
    setQuery(q)
  }, [])

  if (isLoading) {
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
                {paged.length === 0 ? (
                  <Grid xs={12}>
                    <Typography align="center" color="text.secondary">
                      Nenhuma caixinha encontrada.
                    </Typography>
                  </Grid>
                ) : (
                  paged.map((caixinha: Caixinha, index: number) => (
                    <Grid
                      key={caixinha.id || index}
                      xs={12}
                      sm={6}
                      md={4}
                    >
                      <CaixinhaCard key={caixinha.id} caixinha={caixinha} />
                    </Grid>
                  ))
                )}
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4
                }}
              >
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
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
