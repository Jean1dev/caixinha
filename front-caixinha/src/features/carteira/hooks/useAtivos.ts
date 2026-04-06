import useSWR from 'swr'
import { useCallback, useEffect, useState } from 'react'
import {
  getMeusAtivos,
  criarAtivo,
  atualizarAtivo,
  removerAtivo,
} from '../api/carteira.api'
import type {
  AtivoDto,
  AtivosFilter,
  CreateAtivoPayload,
  UpdateAtivoPayload,
} from '../api/carteira.types'
import toast from 'react-hot-toast'

const DEFAULT_SIZE = 10

export function useAtivos(initialCarteiras: string[] = []) {
  const [filter, setFilter] = useState<AtivosFilter>({
    page: 0,
    size: DEFAULT_SIZE,
    carteiras: initialCarteiras,
    tipos: null,
    terms: null,
  })

  const initialCarteirasKey = initialCarteiras.join('|')
  useEffect(() => {
    if (!initialCarteirasKey) return
    const ids = initialCarteirasKey.split('|')
    setFilter((prev) => {
      if (prev.carteiras.length > 0) return prev
      return { ...prev, carteiras: ids, page: 0 }
    })
  }, [initialCarteirasKey])

  const swrKey = filter.carteiras.length > 0 ? ['ativos', JSON.stringify(filter)] : null

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => getMeusAtivos(filter),
    {
      dedupingInterval: 30_000,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )

  const applyFilter = useCallback((newFilter: Partial<AtivosFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter, page: 0 }))
  }, [])

  const changePage = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, page }))
  }, [])

  const changePageSize = useCallback((size: number) => {
    setFilter((prev) => ({ ...prev, size, page: 0 }))
  }, [])

  const criar = useCallback(async (payload: CreateAtivoPayload) => {
    await criarAtivo(payload)
    mutate()
  }, [mutate])

  const atualizar = useCallback(async (payload: UpdateAtivoPayload) => {
    try {
      await atualizarAtivo(payload)
      toast.success('Ativo atualizado')
      mutate()
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao atualizar ativo')
    }
  }, [mutate])

  const remover = useCallback(async (ativoId: string) => {
    try {
      await removerAtivo(ativoId)
      toast.success('Ativo removido')
      mutate()
    } catch {
      toast.error('Erro ao remover ativo')
    }
  }, [mutate])

  return {
    ativos: (data?.content ?? []) as AtivoDto[],
    page: data?.pageable.pageNumber ?? 0,
    totalElements: data?.totalElements ?? 0,
    pageSize: data?.size ?? DEFAULT_SIZE,
    isLoading,
    error,
    filter,
    applyFilter,
    changePage,
    changePageSize,
    criar,
    atualizar,
    remover,
    refresh: mutate,
  }
}
