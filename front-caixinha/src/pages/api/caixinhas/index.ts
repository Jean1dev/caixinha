import { fetchCaixinhasCatalog, filterCaixinhasByQuery } from '@/features/caixinha/api/caixinha.api'
import type { Caixinha } from '@/types/types'

interface IGetCaixinhasQuery {
  query: string
}

export async function getCaixinhas(search?: IGetCaixinhasQuery): Promise<Caixinha[]> {
  const all = await fetchCaixinhasCatalog()
  return filterCaixinhasByQuery(all, search?.query)
}
