import type { IMeusEmprestimos, LoansForApprove, IBillingDate } from '@/types/types'

export type LoanStatus = 'Pendente' | 'Em dia' | 'Atrasado' | 'Quitado'

export interface EmprestimoView {
  uid: string
  caixinha: string
  caixinhaId: string
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
  if (loan.paidInstallments != null) return loan.paidInstallments
  if (loan.isPaidOff) return loan.parcelas || loan.billingDates?.length || 1

  const parcelas = loan.parcelas || loan.billingDates?.length || 1
  const totalValue = loan.totalValue ?? loan.valueRequested
  if (totalValue <= 0) return 0
  const totalPaid = loan.totalPaid ?? (
    loan.remainingAmount != null ? Math.max(totalValue - loan.remainingAmount, 0) : 0
  )
  return Math.min(Math.floor((totalPaid * parcelas + 0.001) / totalValue), parcelas)
}

function nextDueDate(loan: LoansForApprove, pagas: number): string | null {
  if (loan.nextBillingDate !== undefined) return loan.nextBillingDate
  const dates = loan.billingDates ?? []
  const next = dates.some((b) => b.status != null)
    ? dates.find((b) => b.status !== 'paid')
    : dates[pagas]
  return next?.data ?? null
}

function toView(loan: LoansForApprove, status: LoanStatus): EmprestimoView {
  const parcelas = loan.parcelas || (loan.billingDates?.length ?? 1) || 1
  const resolvedStatus: LoanStatus = status === 'Quitado'
    ? 'Quitado'
    : status === 'Pendente'
      ? 'Pendente'
      : loan.isOverdue
        ? 'Atrasado'
        : 'Em dia'
  const pagas = resolvedStatus === 'Quitado' ? parcelas : paidCount(loan)
  const totalValue = loan.totalValue ?? loan.valueRequested
  const valorParcela = parcelas > 0 ? totalValue / parcelas : totalValue
  const restante =
    loan.remainingAmount ?? Math.max(totalValue - (loan.totalPaid ?? valorParcela * pagas), 0)

  return {
    uid: loan.uid,
    caixinha: loan.caixinha ?? 'Caixinha',
    caixinhaId: loan.caixinhaId ?? '',
    valor: loan.valueRequested,
    parcelas,
    pagas,
    proxima: resolvedStatus === 'Quitado' ? null : nextDueDate(loan, pagas),
    valorParcela,
    totalValue,
    restante,
    status: resolvedStatus,
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
