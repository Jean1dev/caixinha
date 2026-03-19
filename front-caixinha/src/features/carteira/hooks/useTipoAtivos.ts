import useSWR from 'swr'
import { getTipoAtivos } from '../api/carteira.api'
import type { TipoAtivoOption } from '../api/carteira.types'

// Tipos de ativo mudam raramente — cache de 1h
export function useTipoAtivos() {
  const { data, isLoading } = useSWR<TipoAtivoOption[]>(
    'tipo-ativos',
    getTipoAtivos,
    {
      dedupingInterval: 3_600_000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return { tipoAtivos: data ?? [], isLoading }
}
