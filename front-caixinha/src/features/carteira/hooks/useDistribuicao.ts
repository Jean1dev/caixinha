import useSWR from 'swr'
import { getDistribuicaoPorMeta } from '../api/carteira.api'
import type { DistribuicaoPorMeta } from '../api/carteira.types'

export function useDistribuicao(carteiraId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<DistribuicaoPorMeta>(
    carteiraId ? ['distribuicao', carteiraId] : null,
    () => getDistribuicaoPorMeta(carteiraId!),
    {
      dedupingInterval: 60_000,
      revalidateOnFocus: false,
    }
  )

  const labels = Object.keys(data ?? {})
  const series = Object.values(data ?? {}) as number[]
  const total = series.reduce((acc, v) => acc + v, 0)

  return { data, labels, series, total, isLoading, error, refresh: mutate }
}
