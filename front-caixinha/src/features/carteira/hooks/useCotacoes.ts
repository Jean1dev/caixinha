import useSWR from 'swr'
import { getSlideAcoes } from '../api/carteira.api'
import type { Cotacao } from '../api/carteira.types'

// Cotações: polling a cada 30s
export function useCotacoes() {
  const { data, isLoading } = useSWR<Cotacao[]>(
    'cotacoes',
    getSlideAcoes,
    {
      refreshInterval: 30_000,
      dedupingInterval: 10_000,
      revalidateOnFocus: false,
    }
  )

  return { cotacoes: data ?? [], isLoading }
}
