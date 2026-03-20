import useSWR from 'swr'
import { useUserAuth } from '@/hooks/useUserAuth'
import { fetchUltimoEmprestimoPendente } from '../api/caixinha.api'
import type { UltimoEmprestimoPendenteResponse } from '../api/caixinha.types'
import { caixinhaUltimoPendenteKey } from '../api/swr-keys'

export function useUltimoEmprestimoPendente() {
  const { user } = useUserAuth()
  const canFetch = Boolean(user?.name && user?.email)

  const { data, error, isLoading, mutate } = useSWR<UltimoEmprestimoPendenteResponse>(
    canFetch ? caixinhaUltimoPendenteKey(user.name, user.email) : null,
    () => fetchUltimoEmprestimoPendente(user.name, user.email),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
    }
  )

  return {
    resultado: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
