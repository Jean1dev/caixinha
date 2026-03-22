import { useCaixinhaContext } from '@/features/caixinha/context/CaixinhaContext'
import type { Caixinha } from '@/types/types'

export function useCaixinhaSelect() {
  const { caixinha, setCaixinha } = useCaixinhaContext()

  const toggleCaixinha = (c: Caixinha | undefined) => {
    if (!c) return
    setCaixinha(c)
  }

  return { caixinha, toggleCaixinha }
}
