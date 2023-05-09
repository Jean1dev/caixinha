export interface Caixinha {
  members: any[]
  currentBalance: any
  deposits: any[]
  loans: any[]
  id: string
}

export interface IMeusEmprestimos {
  caixinhas: EmprestimoCaixinha[]
}

export interface EmprestimoCaixinha {
  currentBalance: number
  myLoans: LoansForApprove[]
  loansForApprove: LoansForApprove[]
}

export interface LoansForApprove {
  requiredNumberOfApprovals: number
  description: string
  approvals: number
  interest: number
  fees: number
  valueRequested: number
  date: string
  totalValue: number
  approved: boolean
  uid: string
  memberName: string
}
