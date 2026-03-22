import axios from 'axios'
import { asyncGetWithParamethers, retornaComAtraso } from '@/pages/api/api.service'
import { CARTEIRA_SERVICE } from '@/constants/ApiConts'
import type {
  AtivoDto,
  AtivosFilter,
  Carteira,
  Cotacao,
  CreateAtivoPayload,
  CreateCarteiraPayload,
  DistribuicaoPorMeta,
  NovoAporte,
  SearchQuery,
  SpringPage,
  TipoAtivoOption,
  UpdateAtivoPayload,
} from './carteira.types'

// ─── HTTP Client ──────────────────────────────────────────────────────────────

function isDev() {
  if (process.env.NEXT_PUBLIC_API_CARTEIRA) return false
  return process.env.NODE_ENV === 'development'
}

const dev = isDev()
const baseURL = process.env.NEXT_PUBLIC_API_CARTEIRA || CARTEIRA_SERVICE

const http = axios.create({ baseURL, timeout: 30000 })

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
)

async function request<T>(url: string, method: string, body?: any): Promise<T> {
  const response = await http({ url, method, data: body })
  return response.data as T
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function setDefaultHeaders(user: string, email: string) {
  http.defaults.headers.common['user'] = user
  http.defaults.headers.common['email'] = email
}

// ─── Carteiras ────────────────────────────────────────────────────────────────

export async function getMinhasCarteiras(user: string, email: string): Promise<Carteira[]> {
  if (dev) {
    return retornaComAtraso([
      { id: '6499dee25b06ad77e23ccaad', nome: 'minha-primeira-carteira', quantidadeAtivos: 0 },
      { id: '6496dee25b06ad77e23ccaad', nome: 'outra carteira', quantidadeAtivos: 2 },
    ])
  }
  return request<Carteira[]>(`/carteira?user=${user}&email=${email}`, 'GET')
}

export async function criarNovaCarteira(payload: CreateCarteiraPayload): Promise<void> {
  return request('/carteira', 'POST', payload)
}

export async function consolidar(carteiraId: string): Promise<void> {
  if (dev) return retornaComAtraso({})
  return request(`/carteira/consolidar/${carteiraId}`, 'POST')
}

export async function getDistribuicaoPorMeta(carteiraId: string): Promise<DistribuicaoPorMeta> {
  if (dev) {
    return retornaComAtraso({
      Cryptomoedas: 25,
      'Renda Fixa': 0,
      'Real Estate': 0,
      'Ações Internacionais': 0,
      'Fundos Imobiliarios': 0,
      'Ações Nacionais': 75,
    })
  }
  return request<DistribuicaoPorMeta>(`/carteira/distribuicao-por-meta/${carteiraId}`, 'GET')
}

// ─── Ativos ───────────────────────────────────────────────────────────────────

export async function getMeusAtivos(params: AtivosFilter): Promise<SpringPage<AtivoDto>> {
  if (dev) {
    return retornaComAtraso({
      content: [
        {
          id: '64a32459bc8fe91194c8e2b6',
          carteira: '64a31a89e5be69144c4aac8c',
          tipoAtivo: 'ACAO_NACIONAL',
          nome: 'PETR4',
          nota: 5,
          quantidade: 2,
          valorAtual: 66.23,
          image: 'https://s3-symbol-logo.tradingview.com/brasileiro-petrobras--600.png',
        },
        {
          id: '64a32459bc8fe91194c8e2b1',
          carteira: '64a31a89e5be69144c4aac8c',
          tipoAtivo: 'ACAO_NACIONAL',
          nome: 'DASA3',
          nota: 9,
          quantidade: 4,
          valorAtual: 12.18,
          image: 'https://s3-symbol-logo.tradingview.com/dasa-on-nm--600.png',
        },
        {
          id: '64a32459bc8fe91194c8A2b1',
          carteira: '64a31a89e5be69144c4aac8c',
          tipoAtivo: 'FII',
          nome: 'KNRI11',
          nota: 1,
          quantidade: 4,
          valorAtual: 12.18,
          image: null,
        },
      ],
      pageable: { sort: { empty: true, sorted: false, unsorted: true }, offset: 0, pageNumber: 0, pageSize: 10, paged: true, unpaged: false },
      totalPages: 1,
      totalElements: 3,
      last: true,
      size: 3,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 3,
      first: true,
      empty: false,
    })
  }
  return asyncGetWithParamethers(`${baseURL}/carteira/meus-ativos`, {
    page: params.page,
    size: params.size,
    carteiras: params.carteiras.join(','),
    tipos: params.tipos ? params.tipos.join(',') : null,
    terms: params.terms,
  })
}

export async function criarAtivo(payload: CreateAtivoPayload): Promise<AtivoDto> {
  return request<AtivoDto>('/ativo', 'POST', payload)
}

export async function atualizarAtivo(payload: UpdateAtivoPayload): Promise<void> {
  if (dev) return retornaComAtraso(true)
  return request('/ativo', 'PUT', payload)
}

export async function removerAtivo(ativoId: string): Promise<void> {
  if (dev) return retornaComAtraso(true)
  return request(`/ativo/${ativoId}`, 'DELETE')
}

export async function getTipoAtivos(): Promise<TipoAtivoOption[]> {
  const data = await request<any>('/ativo/tipo-ativos', 'GET')
  return Object.values(data['TipoAtivo']).map((it: any) => ({
    label: it[Object.keys(it)[0]],
    value: Object.keys(it)[0],
  }))
}

export async function getListaSugestao(query: SearchQuery): Promise<string[]> {
  if (dev) return retornaComAtraso(['PETR4', 'ABCB4', 'ALUP11'])
  return request<string[]>(`/ativo/sugestao?query=${query.query}&onlyCrypto=${query.crypto}`, 'GET')
}

// ─── Aporte ───────────────────────────────────────────────────────────────────

export async function calcularAporte(carteiraId: string, valor: number): Promise<NovoAporte> {
  if (dev) {
    return retornaComAtraso({
      recomendacaoAporteList: [
        {
          recomendacao: 39.5,
          ativo: { tipoAtivo: 'ACAO_NACIONAL', localAlocado: 'IRBR3', percentualRecomendado: 0, valorAtual: 39.5, nota: 5, percentualTotal: 97.5, quantidade: 1, ticker: 'IRBR3' },
        },
        {
          recomendacao: 1.02,
          ativo: { tipoAtivo: 'ACAO_NACIONAL', localAlocado: 'OIBR3', percentualRecomendado: 0, valorAtual: 1.02, nota: 7, percentualTotal: 2.5, quantidade: 1, ticker: 'OIBR3' },
        },
      ],
      metaComValorRecomendados: [
        { tipoAtivo: 'FII', valorRecomendado: 9.83 },
        { tipoAtivo: 'ACAO_INTERNACIONAL', valorRecomendado: 6.55 },
        { tipoAtivo: 'RENDA_FIXA', valorRecomendado: 32.76 },
        { tipoAtivo: 'ACAO_NACIONAL', valorRecomendado: 30.69 },
        { tipoAtivo: 'CRYPTO', valorRecomendado: 0 },
      ],
    })
  }
  return request<NovoAporte>(`/carteira/novo-aporte/${carteiraId}`, 'POST', { valor })
}

// ─── Cotações ─────────────────────────────────────────────────────────────────

export async function getSlideAcoes(): Promise<Cotacao[]> {
  if (dev) {
    return retornaComAtraso([
      { ticker: 'PETR4', type: '-', variation: 2.34 },
      { ticker: 'ABCB4', type: '+', variation: 0.15 },
      { ticker: 'ALUP11', type: '+', variation: 5.34 },
      { ticker: 'AAPL', type: '-', variation: 2.34 },
      { ticker: 'TOTS3', type: '+', variation: 1 },
    ])
  }
  return request<Cotacao[]>('/quote', 'GET')
}

// ─── Metas e Critérios ────────────────────────────────────────────────────────

export async function getMetaPronta(tipoMeta: string): Promise<any> {
  return request(`/carteira/meta?tipo=${tipoMeta}`, 'GET')
}

export async function getCriterios(tipo: string): Promise<any> {
  return request(`/criterio?tipo=${tipo}`, 'GET')
}

export async function getUserIdByEmailAndUser(user?: string, email?: string): Promise<any> {
  const u = user ?? (http.defaults.headers.common['user'] as string)
  const e = email ?? (http.defaults.headers.common['email'] as string)
  return request(`/usuarios?name=${u}&email=${e}`, 'GET')
}
