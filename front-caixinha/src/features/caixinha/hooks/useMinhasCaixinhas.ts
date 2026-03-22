import useSWR from 'swr'
import { useUserAuth } from '@/hooks/useUserAuth'
import { fetchMinhasCaixinhas } from '../api/caixinha.api'
import type { Caixinha } from '../api/caixinha.types'
import { caixinhaMinhasKey } from '../api/swr-keys'

export function useMinhasCaixinhas() {
  const { user } = useUserAuth()
  const canFetch = Boolean(user?.name && user?.email)

  const { data, error, isLoading, mutate } = useSWR<Caixinha[]>(
    canFetch ? caixinhaMinhasKey(user.name, user.email) : null,
    () => fetchMinhasCaixinhas(user.name, user.email),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
      fallbackData: [],
    }
  )

  return {
    caixinhas: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  }
}
