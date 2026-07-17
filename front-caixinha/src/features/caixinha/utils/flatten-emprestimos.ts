import type { IMeusEmprestimos, LoansForApprove, IBillingDate } from '@/types/types'

export type LoanStatus = 'Pendente' | 'Em dia' | 'Quitado'

export interface EmprestimoView {
  uid: string
  caixinha: string
  valor: number
  parcelas: number
  pagas: number
  proxima: string | null
  valorParcela: number
  totalValue: number
  restante: number
  status: LoanStatus
  billingDates: IBillingDate[]
  raw: LoansForApprove
}

function paidCount(loan: LoansForApprove): number {
  const dates = loan.billingDates ?? []
  if (dates.length) {
    return dates.filter((b) => b.valor != null).length
  }
  return loan.isPaidOff ? loan.parcelas : 0
}

function nextDueDate(loan: LoansForApprove): string | null {
  const dates = loan.billingDates ?? []
  const next = dates.find((b) => b.valor == null)
  return next?.data ?? null
}

function toView(loan: LoansForApprove, status: LoanStatus): EmprestimoView {
  const parcelas = loan.parcelas || (loan.billingDates?.length ?? 1) || 1
  const pagas = status === 'Quitado' ? parcelas : paidCount(loan)
  const totalValue = loan.totalValue ?? loan.valueRequested
  const valorParcela = parcelas > 0 ? totalValue / parcelas : totalValue
  const restante =
    loan.remainingAmount ?? Math.max(valorParcela * (parcelas - pagas), 0)

  return {
    uid: loan.uid,
    caixinha: loan.caixinha ?? 'Caixinha',
    valor: loan.valueRequested,
    parcelas,
    pagas,
    proxima: status === 'Quitado' ? null : nextDueDate(loan),
    valorParcela,
    totalValue,
    restante,
    status,
    billingDates: loan.billingDates ?? [],
    raw: loan,
  }
}

// Flattens the three per-caixinha loan buckets into a single, status-tagged list
// used by the master-detail Meus empréstimos screen.
export function flattenEmprestimos(items: IMeusEmprestimos): EmprestimoView[] {
  const out: EmprestimoView[] = []
  for (const caixa of items.caixinhas ?? []) {
    caixa.emprestimosParaAprovar?.forEach((l) => out.push(toView(l, 'Pendente')))
    caixa.meusEmprestimos?.forEach((l) => out.push(toView(l, 'Em dia')))
    caixa.meusEmprestimosQuitados?.forEach((l) => out.push(toView(l, 'Quitado')))
  }
  return out
}

export const brl = (n: number) =>
  'R$ ' +
  (n ?? 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
