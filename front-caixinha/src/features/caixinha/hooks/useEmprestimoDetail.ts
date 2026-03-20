import useSWR from 'swr'
import { fetchEmprestimo, fetchMeusPagamentos } from '../api/caixinha.api'
import type { LoansForApprove, MeuPagamento } from '../api/caixinha.types'
import { caixinhaEmprestimoKey, caixinhaMeusPagamentosKey } from '../api/swr-keys'

export function useEmprestimoDetail(uid: string | null) {
  const { data, error, isLoading, mutate } = useSWR<LoansForApprove>(
    uid ? caixinhaEmprestimoKey(uid) : null,
    () => fetchEmprestimo(uid!),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
    }
  )

  return {
    emprestimo: data ?? null,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useMeusPagamentos(uid: string | null) {
  const { data, error, isLoading, mutate } = useSWR<MeuPagamento[]>(
    uid ? caixinhaMeusPagamentosKey(uid) : null,
    () => fetchMeusPagamentos(uid!),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
      fallbackData: [],
    }
  )

  return {
    pagamentos: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  }
}
