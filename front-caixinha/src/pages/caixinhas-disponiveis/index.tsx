import {
  Typography,
  Box,
  Container,
  Pagination,
  Stack
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

export default function Home() {
  const [data, setData] = useState<Caixinha[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Caixinhas
                </Typography>

              </Stack>

            </Stack>
            <CaixinhaSearch search={search} />
            <Grid
              container
              spacing={{
                xs: 3,
                lg: 4
              }}
            >
              {data.map((caixinha: Caixinha, index: any) => (
                <Grid
                  key={index}
                  xs={12}
                  md={4}
                >
                  <CaixinhaCard key={caixinha.id} caixinha={caixinha} />
                </Grid>

              ))}
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Pagination
                count={1}
                size="small"
              />
            </Box>
          </Stack>
        </Container>
      </Box>
      <Footer/>
    </Layout>
  )
}