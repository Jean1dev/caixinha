import useSWR from 'swr'
import { fetchDadosAnaliseCaixinha } from '../api/caixinha.api'
import { caixinhaAnaliseKey } from '../api/swr-keys'

export function useAnaliseCaixinha(caixinhaId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    caixinhaId ? caixinhaAnaliseKey(caixinhaId) : null,
    () => fetchDadosAnaliseCaixinha(caixinhaId!),
    {
      revalidateOnFocus: true,
      dedupingInterval: 60_000,
    }
  )

  return {
    dados: data ?? null,
    isLoading,
    error,
    refresh: mutate,
  }
}
