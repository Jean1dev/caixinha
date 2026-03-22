import { caixinhaHttp, getCaixinhaBaseUrl } from './caixinha-http'
import type {
  Caixinha,
  ChavesPixResponse,
  ExtratoLinha,
  ExtratoQueryParams,
  IGerarLinkPagamentoBody,
  IMeusEmprestimos,
  MeuPagamento,
  SolicitarRenegociacaoResponse,
  UltimoEmprestimoPendenteResponse,
} from './caixinha.types'
import type { LoansForApprove } from '@/types/types'
import caixinhasCatalogMock from '@/pages/api/caixinhas/data'
import minhasCaixinhasMock from '@/pages/api/caixinhas-disponiveis/data'
import meusEmprestimosMock from '@/pages/api/meus-emprestimos/data'
import analiseCaixinhaMock from '@/pages/api/analise-caixinha/data'

const EMPRESTIMO_CODE_FALLBACK =
  'ZE1oGnOPHdf4QtEvPpILx97EPHvdjmpw9wbE9P4bvmr6AzFuIbaQtQ=='

function isCaixinhaDev() {
  if (process.env.NEXT_PUBLIC_API_URL) return false
  return process.env.NODE_ENV === 'development'
}

function retornaComAtraso<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 1000)
  })
}

export function filterCaixinhasByQuery(list: Caixinha[], query?: string): Caixinha[] {
  if (!query?.trim()) return list
  return list.filter((c) => c.name?.includes(query))
}

export async function fetchCaixinhasCatalog(): Promise<Caixinha[]> {
  if (isCaixinhaDev()) {
    return retornaComAtraso(caixinhasCatalogMock as Caixinha[])
  }
  const { data } = await caixinhaHttp.get<Caixinha[]>('/get-caixinhas')
  return data
}

export async function fetchMinhasCaixinhas(name: string, email: string): Promise<Caixinha[]> {
  if (isCaixinhaDev()) {
    return retornaComAtraso(minhasCaixinhasMock as Caixinha[])
  }
  const { data } = await caixinhaHttp.get<Caixinha[]>('/minhas-caixinhas', {
    params: { name, email },
  })
  return data
}

export async function fetchMeusEmprestimos(params: {
  name: string
  email: string
}): Promise<IMeusEmprestimos> {
  if (isCaixinhaDev()) {
    return retornaComAtraso(meusEmprestimosMock as IMeusEmprestimos)
  }
  const { data } = await caixinhaHttp.get<IMeusEmprestimos>('/meus-emprestimos', {
    params: { name: params.name, email: params.email },
  })
  return data
}

export async function fetchDadosAnaliseCaixinha(idCaixinha: string) {
  if (isCaixinhaDev()) {
    return retornaComAtraso(analiseCaixinhaMock)
  }
  const { data } = await caixinhaHttp.get(`/dados-analise`, {
    params: { caixinhaId: idCaixinha },
  })
  return data
}

export function buildExtratoRequestParams(p: ExtratoQueryParams): Record<string, unknown> {
  if (p.caixinhaId && !p.somenteMeu) {
    return {
      depositos: p.depositos,
      emprestimos: p.emprestimos,
      caixinhaId: p.caixinhaId,
    }
  }
  return {
    meuExtrato: p.somenteMeu,
    depositos: p.depositos,
    emprestimos: p.emprestimos,
    memberName: p.memberName,
  }
}

export async function fetchExtrato(p: ExtratoQueryParams): Promise<ExtratoLinha[]> {
  if (isCaixinhaDev()) {
    return retornaComAtraso([
      {
        id: '64765f0bf72fe795ddd61c34',
        tipo: 'DEPOSITO',
        valor: 25,
        nick: 'jean',
        status: 'completed',
        date: '30/05/2023',
      },
      {
        id: '64766bc201dd4e6d382db357',
        tipo: 'DEPOSITO',
        valor: 25.89,
        nick: 'jean',
        status: 'completed',
        date: '30/05/2023',
      },
    ])
  }
  const { data } = await caixinhaHttp.get<ExtratoLinha[]>('/get-extrato', {
    params: buildExtratoRequestParams(p),
  })
  return data
}

export async function fetchEmprestimo(uid: string): Promise<LoansForApprove> {
  if (isCaixinhaDev()) {
    return retornaComAtraso({
      requiredNumberOfApprovals: 1,
      description: 'sera que foi mesmo?',
      approvals: 1,
      interest: 3,
      fees: 0,
      valueRequested: 5,
      date: '17/07/2023',
      totalValue: 5.15,
      approved: true,
      uid: '044b0dd2-a21f-4b6f-b0f1-f93865e0ead0',
      memberName: 'Jeanluca FP',
      parcelas: 0,
      billingDates: [
        { valor: 14.8, data: '16/08/2023' },
        { valor: 14.8, data: '16/08/2023' },
      ],
    })
  }
  const { data } = await caixinhaHttp.get<LoansForApprove>('/get-emprestimo', {
    params: { uid },
  })
  return data
}

export async function fetchMeusPagamentos(uid: string): Promise<MeuPagamento[]> {
  if (isCaixinhaDev()) {
    return retornaComAtraso([
      {
        caixinha: 'caixinha',
        description: 'description',
        value: 25,
        date: '30/05/2023',
      },
    ])
  }
  const { data } = await caixinhaHttp.get<MeuPagamento[]>('/get-meus-pagamentos', {
    params: { uid },
  })
  return data
}

export async function fetchUltimoEmprestimoPendente(
  name: string,
  email: string
): Promise<UltimoEmprestimoPendenteResponse> {
  if (isCaixinhaDev()) {
    const exists = new Date().getMinutes() % 2 === 0
    return retornaComAtraso({
      exists,
      data: {
        _id: '6525c854c1f42464218bef74',
        approved: true,
        member: { name: 'Jeanluca FP', email: 'jeanlucafp@gmail.com' },
        date: '2023-10-10T21:55:32.544Z',
        valueRequested: { value: 50 },
        fees: { value: 0 },
        interest: { value: 1 },
        box: null,
        approvals: 1,
        description: 'Preciso para pagar o Arnaldo',
        payments: [],
        uid: '068c8030-4f1a-4568-a8f0-38497dbd9da2',
        installments: 0,
        memberName: 'Jeanluca FP',
        requiredNumberOfApprovals: 6,
        listOfMembersWhoHaveAlreadyApproved: [
          { name: 'Jeanluca FP', email: 'jeanlucafp@gmail.com' },
        ],
        billingDates: ['2023-11-09T21:55:32.544Z'],
        totalValue: { value: 50.5 },
        boxId: '646f538de5cd54cc6344ec69',
      },
    })
  }
  const { data } = await caixinhaHttp.get<UltimoEmprestimoPendenteResponse>(
    '/get-ultimo-emprestimo-pendente',
    { params: { name, email } }
  )
  return data
}

export async function aprovarEmprestimo(payload: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/aprovar-emprestimo', payload)
  return data
}

export async function doEmprestimo(params: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/caixinha/emprestimo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(
        typeof json?.message === 'string' ? json.message : 'Erro ao solicitar empréstimo'
      )
    }
    return json
  }
  const code =
    process.env.CAIXINHA_EMPRESTIMO_CODE ||
    process.env.EMPIRESTIMO_API_CODE ||
    EMPRESTIMO_CODE_FALLBACK
  const { data } = await caixinhaHttp.post(
    `/emprestimo?code=${encodeURIComponent(code)}`,
    JSON.stringify(params),
    { headers: { 'Content-Type': 'application/json' } }
  )
  return data
}

export async function doDeposito(params: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/deposito', JSON.stringify(params), {
    headers: { 'Content-Type': 'application/json' },
  })
  return data
}

export async function joinABox(params: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/user-join-caixinha', JSON.stringify(params), {
    headers: { 'Content-Type': 'application/json' },
  })
  return data
}

export async function pagarEmprestimo(params: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/pagamento-emprestimo', params)
  return data
}

export async function recusarEmprestimo(payload: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/recusar-emprestimo', payload)
  return data
}

export async function removerEmprestimo(payload: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/remover-emprestimo', payload)
  return data
}

export async function getValorParcelas(params: unknown) {
  if (isCaixinhaDev()) {
    return retornaComAtraso([{ value: 2.58 }, { value: 2.58 }])
  }
  const { data } = await caixinhaHttp.post('/calcular-parcelas', params)
  return data
}

export async function getChavesPix(caixinhaID: string): Promise<ChavesPixResponse> {
  if (isCaixinhaDev()) {
    return retornaComAtraso({
      keysPix: ['fe52da16-71c9-47f6-9daa-2e89034f97b0'],
      urlsQrCodePix: ['https://www.imgonline.com.ua/examples/qr-code.png'],
    })
  }
  const { data } = await caixinhaHttp.get<ChavesPixResponse>('/get-chaves-pix', {
    params: { caixinhaId: caixinhaID },
  })
  return data
}

export async function updatePerfil(body: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/update-profile-member', body)
  return data
}

export async function sairDaCaixinha(body: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/remover-membro', body)
  return data
}

export async function gerarLinkDePagamento(body: IGerarLinkPagamentoBody) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/gerar-link-pagamento', body)
  return data
}

export async function solicitarRenegociacao(
  body: unknown
): Promise<SolicitarRenegociacaoResponse> {
  if (isCaixinhaDev()) {
    return retornaComAtraso({
      sugestao: {
        installmentOptions: [1, 2, 3, 4, 5],
        newInterestRate: 3.2,
        reason: 'string',
        newTotalValue: 25,
        id: 'string',
      },
      renegId: 'id-renegociacao',
    })
  }
  const { data } = await caixinhaHttp.post('/solicitar-renegociacao', body)
  return data as SolicitarRenegociacaoResponse
}

export async function aceitarRenegociacao(body: unknown) {
  if (isCaixinhaDev()) return retornaComAtraso(true)
  const { data } = await caixinhaHttp.post('/renegociar', body)
  return data
}

export const getExtrato = fetchExtrato
export const getEmprestimo = fetchEmprestimo
export const getMeusPagamentos = fetchMeusPagamentos
export const getUltimoEmprestimoPendente = fetchUltimoEmprestimoPendente

export { getCaixinhaBaseUrl } from './caixinha-http'
