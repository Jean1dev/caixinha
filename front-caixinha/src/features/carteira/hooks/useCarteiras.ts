import useSWR, { mutate } from 'swr'
import { useUserAuth } from '@/hooks/useUserAuth'
import { getMinhasCarteiras, consolidar, criarNovaCarteira } from '../api/carteira.api'
import type { Carteira, CreateCarteiraPayload } from '../api/carteira.types'
import toast from 'react-hot-toast'

const CARTEIRAS_KEY = (user: string, email: string) => ['carteiras', user, email]

export function useCarteiras() {
  const { user } = useUserAuth()

  const { data, error, isLoading, mutate: refresh } = useSWR<Carteira[]>(
    user?.name && user?.email ? CARTEIRAS_KEY(user.name, user.email) : null,
    () => getMinhasCarteiras(user.name, user.email),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
      fallbackData: [],
    }
  )

  const consolidarTodas = async () => {
    const lista = data ?? []
    await Promise.allSettled(
      lista.map(async (carteira) => {
        toast.loading(`Consolidando ${carteira.nome}`, { id: carteira.id })
        try {
          await consolidar(carteira.id)
          toast.success(`Concluído: ${carteira.nome}`, { id: carteira.id })
        } catch {
          toast.error(`Erro ao consolidar ${carteira.nome}`, { id: carteira.id })
        }
      })
    )
    refresh()
  }

  const criar = async (payload: CreateCarteiraPayload) => {
    await criarNovaCarteira(payload)
    refresh()
  }

  return {
    carteiras: data ?? [],
    isLoading,
    error,
    refresh,
    consolidarTodas,
    criar,
  }
}

export function invalidateCarteiras() {
  mutate((key: any) => Array.isArray(key) && key[0] === 'carteiras', undefined, { revalidate: true })
}
