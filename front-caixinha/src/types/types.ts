export interface Caixinha {
  members: any[]
  currentBalance: any
  deposits: any[]
  loans: any[]
  id: string
  name?: string
}

export interface IMeusEmprestimos {
  caixinhas: EmprestimoCaixinha[]
  totalPendente: number,
  totalPago: number,
  totalGeral: number
}

export interface EmprestimoCaixinha {
  currentBalance: number
  meusEmprestimosQuitados: LoansForApprove[]
  meusEmprestimos: LoansForApprove[]
  emprestimosParaAprovar: LoansForApprove[]
}

export interface LoansForApprove {
  open: any
  requiredNumberOfApprovals: number
  description: string
  approvals: number
  interest: number
  fees: number
  valueRequested: number
  date: string
  totalValue?: number
  approved: boolean
  uid: string
  memberName: string
  remainingAmount?: number
  isPaidOff?: boolean
  caixinha?: string
  billingDates: IBillingDate[]
  parcelas: number
}

export interface IBillingDate {
  data: string
  valor: number | null
}

export interface AtivoCarteira {
  id: string
  carteira: string
  tipoAtivo: string
  nome: string
  nota: number
  quantidade: number
  image: string | null
  valorAtual: number
}

export interface INovoAporte {
  recomendacaoAporteList: RecomendacaoAporteList[]
  metaComValorRecomendados: MetaComValorRecomendado[]
}

export interface RecomendacaoAporteList {
  recomendacao: number
  ativo: Ativo
}

export interface Ativo {
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

export interface AtivosListagemCompra {
  codigo: string
  disponivel: boolean
  imgUrl?: string
  nome: string
  valor: number
  variacao: number
  variacaoPositiva: boolean
}