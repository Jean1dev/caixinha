import { useCallback, useState } from 'react'
import { calcularAporte } from '../api/carteira.api'
import type { NovoAporte } from '../api/carteira.types'
import toast from 'react-hot-toast'

export function useAporte() {
  const [resultado, setResultado] = useState<NovoAporte | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calcular = useCallback(async (carteiraId: string, valor: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await calcularAporte(carteiraId, valor)
      setResultado(data)
    } catch (e: any) {
      const msg = e.message ?? 'Erro ao calcular aporte'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const limpar = useCallback(() => {
    setResultado(null)
    setError(null)
  }, [])

  return { resultado, isLoading, error, calcular, limpar }
}
