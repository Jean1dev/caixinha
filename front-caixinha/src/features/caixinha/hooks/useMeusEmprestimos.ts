import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetchMeusEmprestimos } from '../api/caixinha.api'
import type { IMeusEmprestimos } from '../api/caixinha.types'
import { caixinhaMeusEmprestimosKey } from '../api/swr-keys'

const empty: IMeusEmprestimos = {
  caixinhas: [],
  totalPendente: 0,
  totalPago: 0,
  totalGeral: 0,
}

export function useMeusEmprestimos() {
  const { data: session, status } = useSession()
  const name = session?.user?.name
  const email = session?.user?.email
  const canFetch = status !== 'loading' && Boolean(name && email)

  const { data, error, isLoading, mutate } = useSWR<IMeusEmprestimos>(
    canFetch && name && email ? caixinhaMeusEmprestimosKey(name, email) : null,
    () => fetchMeusEmprestimos({ name: name!, email: email! }),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
    }
  )

  return {
    items: data ?? empty,
    isLoading: status === 'loading' || (canFetch && isLoading && !data),
    error,
    refresh: mutate,
  }
}
