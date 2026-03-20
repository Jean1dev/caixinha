import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Caixinha } from '@/types/types'
import { invalidateCaixinhaScopedQueries } from '../api/swr-keys'

const STORAGE_KEY = 'caixinha-select'

type CaixinhaContextValue = {
  caixinha: Caixinha | null
  setCaixinha: (c: Caixinha | null | undefined) => void
}

const CaixinhaContext = createContext<CaixinhaContextValue | null>(null)

function readStoredCaixinha(): Caixinha | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Caixinha
  } catch {
    return null
  }
}

export function CaixinhaProvider({ children }: { children: ReactNode }) {
  const [caixinha, setCaixinhaState] = useState<Caixinha | null>(() => readStoredCaixinha())

  const setCaixinha = useCallback((c: Caixinha | null | undefined) => {
    if (c == null) {
      setCaixinhaState(null)
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      invalidateCaixinhaScopedQueries()
      return
    }
    setCaixinhaState(c)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
    } catch {
      /* ignore */
    }
    invalidateCaixinhaScopedQueries()
  }, [])

  const value = useMemo(() => ({ caixinha, setCaixinha }), [caixinha, setCaixinha])

  return <CaixinhaContext.Provider value={value}>{children}</CaixinhaContext.Provider>
}

export function useCaixinhaContext() {
  const ctx = useContext(CaixinhaContext)
  if (!ctx) {
    throw new Error('useCaixinhaContext requires CaixinhaProvider')
  }
  return ctx
}
