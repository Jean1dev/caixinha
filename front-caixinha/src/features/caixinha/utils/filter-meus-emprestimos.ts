import type { IMeusEmprestimos, LoansForApprove } from '@/types/types'

function matchLoan(loan: LoansForApprove, needle: string): boolean {
  const parts = [
    loan.uid,
    loan.memberName,
    loan.description,
    String(loan.valueRequested ?? ''),
    loan.caixinha,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase())
  return parts.some((p) => p.includes(needle))
}

export function filterMeusEmprestimos(items: IMeusEmprestimos, q: string): IMeusEmprestimos {
  const needle = q.trim().toLowerCase()
  if (!needle) return items
  return {
    ...items,
    caixinhas: items.caixinhas
      .map((caixa) => ({
        ...caixa,
        emprestimosParaAprovar: caixa.emprestimosParaAprovar.filter((l) => matchLoan(l, needle)),
        meusEmprestimos: caixa.meusEmprestimos.filter((l) => matchLoan(l, needle)),
        meusEmprestimosQuitados: caixa.meusEmprestimosQuitados.filter((l) => matchLoan(l, needle)),
      }))
      .filter(
        (caixa) =>
          caixa.emprestimosParaAprovar.length +
            caixa.meusEmprestimos.length +
            caixa.meusEmprestimosQuitados.length >
          0
      ),
  }
}
