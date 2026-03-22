import type { Caixinha, IMeusEmprestimos, LoansForApprove } from '@/types/types'

export type { Caixinha, IMeusEmprestimos, LoansForApprove }

export interface ExtratoQueryParams {
  depositos: boolean
  emprestimos: boolean
  somenteMeu: boolean
  caixinhaId?: string
  memberName?: string | null
}

export interface ExtratoLinha {
  id: string
  tipo: string
  valor: number
  nick: string
  status: string
  date: string
}

export interface IGerarLinkPagamentoBody {
  name: string
  email: string
  valor?: number
  pix?: string
}

export interface UltimoEmprestimoPendenteResponse {
  exists: boolean
  data?: unknown
}

export interface ChavesPixResponse {
  keysPix: string[]
  urlsQrCodePix: string[]
}

export interface MeuPagamento {
  caixinha: string
  description: string
  value: number
  date: string
}

export interface RenegociacaoSugestao {
  installmentOptions: number[]
  newInterestRate: number
  reason: string
  newTotalValue: number
  id: string
}

export interface SolicitarRenegociacaoResponse {
  sugestao: RenegociacaoSugestao
  renegId: string
}
