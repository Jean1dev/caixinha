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
}

export interface EmprestimoCaixinha {
  currentBalance: number
  myLoans: LoansForApprove[]
  loansForApprove: LoansForApprove[]
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
}
