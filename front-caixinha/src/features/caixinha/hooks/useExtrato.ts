import useSWR from 'swr'
import { fetchExtrato } from '../api/caixinha.api'
import type { ExtratoLinha, ExtratoQueryParams } from '../api/caixinha.types'
import { caixinhaExtratoKey } from '../api/swr-keys'

export function useExtrato(params: ExtratoQueryParams | null) {
  const key = params ? caixinhaExtratoKey(params) : null

  const { data, error, isLoading, mutate } = useSWR<ExtratoLinha[]>(
    key,
    () => fetchExtrato(params!),
    {
      revalidateOnFocus: true,
      dedupingInterval: 15_000,
      fallbackData: [],
    }
  )

  return {
    linhas: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  }
}
