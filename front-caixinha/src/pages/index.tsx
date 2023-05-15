import {
  Typography,
  Box,
  Container,
  Grid,
  Pagination,
  Stack} from '@mui/material'
import React from 'react'
import { getCaixinhas } from './api/api.service'
import Layout from '@/components/Layout'
import { Caixinha } from '@/types/types'
import { CaixinhaSearch } from '@/components/caixinha/CaixinhaSearch'
import { CaixinhaCard } from '@/components/caixinha/CaixinhaCard'

export default function Home({ data }: any) {
  
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
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  {/* <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpwardIcon />
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownwardIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button> */}
                </Stack>
              </Stack>
              {/* <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <AddIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add
                </Button>
              </div> */}
            </Stack>
            <CaixinhaSearch />
            <Grid
              container
              spacing={3}
            >
              {data.map((caixinha: Caixinha) => (
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                  key={caixinha.id}
                >
                  <CaixinhaCard caixinha={caixinha} />
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
    </Layout>
  )
}

export async function getServerSideProps() {
  const data = await getCaixinhas()
  return { props: { data } }
}