import {
  Typography,
  Box,
  Container,
  Pagination,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Layout from '@/components/Layout'
import { Caixinha } from '@/types/types'
import { CaixinhaSearch } from '@/components/caixinha/CaixinhaSearch'
import { CaixinhaCard } from '@/components/caixinha/CaixinhaCard'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import { useRouter } from 'next/router'
import { Footer } from '@/components/footer'
import { useCaixinhasCatalog } from '@/features/caixinha/hooks/useCaixinhasCatalog'
import { filterCaixinhasByQuery } from '@/features/caixinha/api/caixinha.api'

const PAGE_SIZE = 6

export default function Home() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const router = useRouter()
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
        sx={{ flexGrow: 1, minHeight: '100vh', py: { xs: 5, md: 8 } }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: '0.5px', lineHeight: 2 }}
          >
            Comunidade
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 0.5, mb: 3 }}
          >
            Caixinhas disponíveis
          </Typography>

          {/* Search */}
          <Box sx={{ maxWidth: 560, mb: 4 }}>
            <CaixinhaSearch search={search} />
          </Box>

          {/* Grid de cards */}
          {paged.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 6 }}>
              Nenhuma caixinha encontrada.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 3,
              }}
            >
              {paged.map((caixinha: Caixinha, index: number) => (
                <CaixinhaCard key={caixinha.id || index} caixinha={caixinha} />
              ))}
            </Box>
          )}

          {/* Paginação */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              size="medium"
              color="primary"
              shape="rounded"
            />
          </Box>
        </Container>
      </Box>
      <Footer />
    </Layout>
  )
}
