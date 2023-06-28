import {
  Typography,
  Box,
  Container,
  Pagination,
  Stack,
  Grid
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Caixinha } from '@/types/types'
import { CaixinhaSearch } from '@/components/caixinha/CaixinhaSearch'
import { CaixinhaCard } from '@/components/caixinha/CaixinhaCard'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import { useRouter } from 'next/router'
import { getCaixinhas } from '../api/api.service'
//import  from '@mui/material/Unstable_Grid2';

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
            <CaixinhaSearch />
            <Grid
              container
              spacing={{
                xs: 3,
                lg: 4
              }}
            >
              {data.map((caixinha: Caixinha) => (
                <CaixinhaCard key={caixinha.id} caixinha={caixinha} />
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
    </Layout>
  )
}