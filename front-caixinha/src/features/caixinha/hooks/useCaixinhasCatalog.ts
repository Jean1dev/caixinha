import useSWR from 'swr'
import { fetchCaixinhasCatalog } from '../api/caixinha.api'
import type { Caixinha } from '../api/caixinha.types'
import { caixinhaCatalogKey } from '../api/swr-keys'

export function useCaixinhasCatalog() {
  const { data, error, isLoading, mutate } = useSWR<Caixinha[]>(caixinhaCatalogKey(), () => fetchCaixinhasCatalog(), {
    revalidateOnFocus: true,
    dedupingInterval: 60_000,
    fallbackData: [],
  })

  return {
    catalog: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  }
}
