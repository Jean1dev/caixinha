import type { ExtratoQueryParams } from './caixinha.types'
import { mutate } from 'swr'

export function caixinhaCatalogKey() {
  return ['caixinha', 'catalog'] as const
}

export function caixinhaMinhasKey(name: string, email: string) {
  return ['caixinha', 'minhas', name, email] as const
}

export function caixinhaMeusEmprestimosKey(name: string, email: string) {
  return ['caixinha', 'meus-emprestimos', name, email] as const
}

export function caixinhaExtratoKey(p: ExtratoQueryParams) {
  return [
    'caixinha',
    'extrato',
    p.caixinhaId ?? '',
    p.memberName ?? '',
    p.depositos,
    p.emprestimos,
    p.somenteMeu,
  ] as const
}

export function caixinhaEmprestimoKey(uid: string) {
  return ['caixinha', 'emprestimo', uid] as const
}

export function caixinhaMeusPagamentosKey(uid: string) {
  return ['caixinha', 'meus-pagamentos', uid] as const
}

export function caixinhaAnaliseKey(caixinhaId: string) {
  return ['caixinha', 'analise', caixinhaId] as const
}

export function caixinhaUltimoPendenteKey(name: string, email: string) {
  return ['caixinha', 'ultimo-pendente', name, email] as const
}

export function invalidateCaixinhaScopedQueries() {
  mutate(
    (key) =>
      Array.isArray(key) &&
      key[0] === 'caixinha' &&
      typeof key[1] === 'string' &&
      [
        'extrato',
        'analise',
        'meus-emprestimos',
        'ultimo-pendente',
        'meus-pagamentos',
        'emprestimo',
      ].includes(key[1] as string),
    undefined,
    { revalidate: true }
  )
}

export function invalidateMinhasCaixinhas() {
  mutate(
    (key) => Array.isArray(key) && key[0] === 'caixinha' && key[1] === 'minhas',
    undefined,
    { revalidate: true }
  )
}
