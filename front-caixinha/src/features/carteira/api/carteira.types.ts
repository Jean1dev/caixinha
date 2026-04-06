// ─── Carteira ─────────────────────────────────────────────────────────────────

export interface Carteira {
  id: string
  nome: string
  quantidadeAtivos: number
}

export interface CreateCarteiraPayload {
  nome: string
  metaDefinida?: string
  ativos?: CreateAtivoPayload[]
}

// ─── Ativo ────────────────────────────────────────────────────────────────────

export interface AtivoDto {
  id: string
  carteira: string
  tipoAtivo: string
  nome: string
  nota: number
  quantidade: number
  image: string | null
  valorAtual: number
}

export interface CreateAtivoPayload {
  tipoAtivo: string
  nota: number
  quantidade: number
  nome: string
  identificacaoCarteira: string
  valorAtual?: number
}

export interface UpdateAtivoPayload {
  identificacao: string
  nota?: number
  quantidade?: number
  valor?: number
}

// ─── Paginação ────────────────────────────────────────────────────────────────

export interface Pageable {
  sort: { empty: boolean; sorted: boolean; unsorted: boolean }
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

export interface SpringPage<T> {
  content: T[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: any
  numberOfElements: number
  first: boolean
  empty: boolean
}

// ─── Filtros ──────────────────────────────────────────────────────────────────

export interface AtivosFilter {
  page: number
  size: number
  carteiras: string[]
  tipos: string[] | null
  terms?: string | null
}

// ─── Aporte ───────────────────────────────────────────────────────────────────

export interface NovoAporte {
  recomendacaoAporteList: RecomendacaoAporte[]
  metaComValorRecomendados: MetaComValorRecomendado[]
}

export interface RecomendacaoAporte {
  recomendacao: number
  ativo: AtivoRecomendado
}

export interface AtivoRecomendado {
  tipoAtivo: string
  localAlocado: string
  percentualRecomendado: number
  valorAtual: number
  nota: number
  percentualTotal: number
  quantidade: number
  ticker: string
}

export interface MetaComValorRecomendado {
  tipoAtivo: string
  valorRecomendado: number
}

// ─── Distribuição ─────────────────────────────────────────────────────────────

export type DistribuicaoPorMeta = Record<string, number>

// ─── Cotação ──────────────────────────────────────────────────────────────────

export interface Cotacao {
  ticker: string
  type: '+' | '-'
  variation: number
}

// ─── Tipos e Critérios ────────────────────────────────────────────────────────

export interface TipoAtivoOption {
  label: string
  value: string
}

export interface Criterio {
  id?: string
  tipo: string
  percentual: number
}

export interface SearchQuery {
  query: string
  crypto: boolean
}
