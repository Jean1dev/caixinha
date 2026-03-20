# Plano de Redesign — Caixinha (grupos de poupança e empréstimos)

Escopo: funcionalidades do produto **Caixinha** no front-end, excluindo módulos já cobertos por outros planos ou domínios distintos: `/carteira`, `/web3`, `/token-market`, `/market`, `/perfil`, `/feed` e `/chat`.

---

## Contexto Atual

### Stack Técnica
- **Next.js** 16.1.5 / **React** 18.2.0 / **TypeScript**
- **MUI** v5
- **ApexCharts** (análise da caixinha)
- **Axios** (`src/pages/api/api.service.ts` + módulos em `src/pages/api/`)
- **Next-Auth** + **`useUserAuth`**
- **SWR** 2.4.1 (dependência presente; **não adotada** de forma consistente no fluxo Caixinha)
- **react-hot-toast** para feedback pontual
- **@react-pdf/renderer** (comprovante/resumo de empréstimo)

### Rotas no Escopo
| Rota | Função |
|------|--------|
| `/` | Home: atalhos, banner, último empréstimo pendente |
| `/caixinhas-disponiveis` | Catálogo de caixinhas + busca |
| `/join` | Entrar em uma caixinha (por `?id=`) |
| `/analise-caixinha` | Painel de métricas da caixinha (`?unique=`) |
| `/emprestimo` | Solicitar novo empréstimo |
| `/deposito` | Depósito (PIX + comprovante) |
| `/extrato` | Movimentações (filtros por tipo / “só meu”) |
| `/meus-emprestimos` | Lista e resumo de empréstimos do usuário |
| `/detalhes-emprestimo` | Detalhe, aprovação, pagamento (`?uid=`) |
| `/renegociacao` | Fluxo de renegociação |
| `/sucesso` | Pós–solicitação de empréstimo |
| `/sucesso/deposito` | Pós-depósito |
| `/error` | Erro genérico |

### APIs Consumidas (CAIXINHA_SERVICE — base `CAIXINHA_SERVICE` em `ApiConts.ts`)

Chamadas diretas e via módulos `src/pages/api/*/index.ts`:

| Endpoint (relativo à base) | Método | Propósito |
|----------------------------|--------|-----------|
| `/get-caixinhas` | GET | Lista de caixinhas (catálogo) |
| `/minhas-caixinhas?name=&email=` | GET | Caixinhas do usuário (seletor no topo) |
| `/meus-emprestimos?name=&email=` | GET | Agregado de empréstimos por caixinha |
| `/dados-analise?caixinhaId=` | GET | Dados do painel de análise |
| `/emprestimo` | POST | Criar solicitação de empréstimo |
| `/calcular-parcelas` | POST | Simulação de parcelas |
| `/deposito` | POST | Registrar depósito |
| `/get-chaves-pix?caixinhaId=` | GET | Chaves e QR Code PIX |
| `/get-extrato` | GET | Linhas do extrato |
| `/get-emprestimo` | GET | Detalhe de um empréstimo (`uid`) |
| `/get-meus-pagamentos` | GET | Pagamentos do mutuário |
| `/get-ultimo-emprestimo-pendente` | GET | Atalho na home |
| `/user-join-caixinha` | POST | Associar usuário à caixinha |
| `/aprovar-emprestimo` | POST | Aprovar (gestor) |
| `/recusar-emprestimo` | POST | Recusar |
| `/remover-emprestimo` | POST | Remover solicitação |
| `/pagamento-emprestimo` | POST | Registrar pagamento |
| `/gerar-link-pagamento` | POST | Link de pagamento |
| `/solicitar-renegociacao` | POST | Obter proposta de renegociação |
| `/renegociar` | POST | Aceitar renegociação |
| `/remover-membro` | POST | Sair da caixinha (também usado a partir de fluxo de perfil) |

**Serviços auxiliares no fluxo Caixinha**
- **STORAGE_SERVICE**: upload de comprovante (`uploadResource` em `api.service.ts`)
- **COMMUNICATION_SERVICE**: notificações (`marcarNotificactionsComoLida` no seletor global — fora do núcleo Caixinha, mas acoplado ao mesmo arquivo)

### Problemas Identificados no Código Atual

1. **Cache global mutável em memória** — `state.cache` em `api.service` e módulos (`getCaixinhas`, `getMinhasCaixinhas`, `getMeusEmprestimos`) usa chaves fixas sem escopo de usuário/sessão; risco de dados cruzados e impossibilidade de invalidação fina após mutações (depósito, empréstimo, join).
2. **Sem camada de dados unificada** — páginas usam `useEffect` + `useState` + `.then()`; não há padrão tipo `features/carteira` (hooks + API tipada + SWR).
3. **`useCaixinhaSelect` força `window.location.reload()`** — troca de caixinha recarrega a app inteira; perde estado e UX.
4. **Interceptor Axios com `debugger` e `console.log`** — comportamento inadequado para produção; erros genéricos (`throw new Error(message)`).
5. **Tipagem fraca** — `any` em payloads e estados (ex.: renegociação, extrato, análise).
6. **Navegação e feedback inconsistentes** — `alert` no join; redirecionamento para `'error'` sem `/` no extrato; estados de loading muitas vezes só `CenteredCircularProgress` em tela cheia.
7. **UI incompleta ou placeholder** — paginação em `/caixinhas-disponiveis` com `count={1}`; filtros laterais em `/meus-emprestimos` com `onFiltersChange` vazio e `lgUp` fixo em `false`.
8. **Detalhe de empréstimo** — título/código hardcoded (`EMP659-7`) em vez de dado da API.
9. **Segurança / manutenção** — `doEmprestimo` usa query string `code` fixa na URL; credencial em código cliente é anti-padrão (deveria estar só no backend ou env).
10. **Duplicidade de identidade** — mistura `useSession` e `useUserAuth` entre telas; parâmetros `name`/`email` repetidos manualmente.
11. **Query params frágeis** — `/analise-caixinha` usa `unique`, `/join` usa `id`; alinhar nomenclatura (`caixinhaId`) e validar presença com empty states.
12. **`doDeposito` com `debugger`** no código de produção.

---

## Visão da Nova Experiência

### Filosofia de Design
- **Contexto de caixinha explícito** — toda tela sensível à caixinha mostra qual grupo está ativo; troca sem reload completo.
- **Hub da caixinha** — uma rota `/caixinha/[id]` (ou `/minha-caixinha`) concentra: resumo, atalhos (depositar, emprestar, extrato, análise), estado dos empréstimos.
- **Ações em painéis** — depósito e solicitação de empréstimo podem abrir como **drawer** ou **stepper** a partir do hub, reduzindo páginas órfãs.
- **Dados com skeleton e revalidação** — lista de caixinhas, extrato e empréstimos com placeholders e retry.
- **Erros tratados de forma uniforme** — toast + estado inline; sem `debugger`.

### Mapa de Telas Redesenhadas

```
/  (home)
  ├── Resumo: caixinha ativa + CTA
  ├── Card “Último empréstimo pendente” (melhor integrado ao hub)
  └── Atalhos para catálogo e hub

/caixinhas-disponiveis
  ├── Lista paginada ou virtualizada de verdade
  └── Entrada para /join?id= → futuro modal “Participar”

/caixinha/[id]   (NOVA — hub)
  ├── Header: nome, saldo/resumo, seletor integrado
  ├── Tabs ou seções: Visão geral | Empréstimos | Extrato | Análise (embed ou link)
  └── FAB ou barra: Depositar | Novo empréstimo

/emprestimo, /deposito
  └── Refatorados: drawer a partir do hub OU páginas com breadcrumb e mesma camada de dados

/extrato
  └── Filtros claros + URL sync (?caixinhaId=, tipos) + paginação se API suportar

/meus-emprestimos
  └── Filtros funcionais, agrupamento por caixinha, mobile-first

/detalhes-emprestimo/[uid]   (rota dinâmica preferível a ?uid=)
  ├── Cabeçalho com dados reais
  └── Ações: aprovar / pagar / PDF em um fluxo coerente

/renegociacao
  └── Lista + proposta em layout de dois passos (seleção → revisão → confirmar)

/analise-caixinha
  └── Alinhar query param ao restante; opcionalmente fundir em /caixinha/[id]?tab=analise
```

---

## Arquitetura Proposta

### 1. Estrutura de Arquivos

```
src/
├── features/
│   └── caixinha/
│       ├── api/
│       │   ├── caixinha.api.ts       # Todas as chamadas ao CAIXINHA_SERVICE (extraídas de api.service + api/caixinhas*)
│       │   └── caixinha.types.ts     # Tipos do domínio (Caixinha, Emprestimo, ExtratoLinha, etc.)
│       ├── hooks/
│       │   ├── useCaixinhasCatalog.ts
│       │   ├── useMinhasCaixinhas.ts
│       │   ├── useCaixinhaContext.ts # substitui reload: React context + persistência
│       │   ├── useExtrato.ts
│       │   ├── useMeusEmprestimos.ts
│       │   ├── useEmprestimoDetail.ts
│       │   ├── useValorParcelas.ts
│       │   ├── useChavesPix.ts
│       │   ├── useAnaliseCaixinha.ts
│       │   └── useRenegociacao.ts
│       └── components/
│           ├── hub/
│           ├── deposito/
│           ├── emprestimo/
│           ├── extrato/
│           ├── emprestimos-list/
│           └── shared/
│               ├── CaixinhaSelector.tsx
│               ├── ValorMonetario (reuso se já existir global)
│               └── EmptyState.tsx
│
├── pages/
│   ├── caixinha/
│   │   └── [id].tsx                  # Hub (NOVA)
│   ├── caixinhas-disponiveis/
│   ├── join/
│   ├── emprestimo/
│   ├── deposito/
│   ├── extrato/
│   ├── meus-emprestimos/
│   ├── detalhes-emprestimo/
│   ├── renegociacao/
│   └── analise-caixinha/
```

### 2. Estratégia de Cache (SWR)

Substituir `state.cache` Map por chaves SWR incluindo **usuário e caixinha** onde fizer sentido.

| Dado | TTL / estratégia |
|------|------------------|
| Catálogo `get-caixinhas` | 60s + revalidate on focus |
| `minhas-caixinhas` | 30s; invalidar após `join` / `remover-membro` |
| `meus-emprestimos` | 30s; invalidar após criar empréstimo, pagar, aprovar, renegociar |
| Detalhe empréstimo | 30s |
| Extrato | Curto (15–30s) ou sem cache se sempre “ao vivo” |
| Chaves PIX | 5–10m ou on-demand ao abrir depósito |
| Simulação parcelas | Sem cache (deduping curto só durante digitação) |
| Dados análise | 60s |

**Invalidação**
- Após **depósito** → `extrato`, `analise`, `minhas-caixinhas` (se saldo mudar no payload)
- Após **empréstimo** → `meus-emprestimos`, detalhe, `get-ultimo-emprestimo-pendente`
- Após **join** → `minhas-caixinhas`, catálogo opcional

### 3. Separação de Responsabilidades

**Antes:** página com `useEffect` + chamadas diretas a `api.service` / `../api/caixinhas`.

**Depois:** página orquestra layout → hooks (`useX`) → `caixinha.api.ts` (HTTP puro).

### 4. Contexto de Caixinha sem Reload

- `CaixinhaProvider` no `_app` ou no layout logado.
- Persistência: `localStorage` (como hoje) mas atualização via `setState` + `mutate` SWR nas queries dependentes.
- Opcional: sincronizar `caixinhaId` com query na hub `/caixinha/[id]` para URLs compartilháveis.

---

## Redesign de UX — Wireframes Conceituais

### Hub `/caixinha/[id]`

```
┌────────────────────────────────────────────────────────────────┐
│  ← Voltar    [Nome da caixinha ▼]              [Análise] [⚙]   │
├────────────────────────────────────────────────────────────────┤
│  Saldo / disponível    Em aberto    Próximos vencimentos       │
│  ─────────────────────────────────────────────────────────────│
│  [Depositar]  [Pedir empréstimo]  [Ver extrato]                │
├────────────────────────────────────────────────────────────────┤
│  Atividade recente (últimas N linhas)                            │
│  Empréstimos pendentes da caixinha (se aplicável)                │
└────────────────────────────────────────────────────────────────┘
```

### Drawer de depósito

```
┌─────────────────────────────┐
│  Depósito              [✕]  │
│  Caixinha: X                │
│  Valor: R$ [____]           │
│  Comprovante [anexar]       │
│  [QR PIX]  (se disponível)  │
│  [Confirmar]                │
└─────────────────────────────┘
```

### Meus empréstimos (desktop)

```
┌────────────────────────────────────────────────────────────────┐
│  Meus empréstimos              [Filtros ▼] [Agrupar: caixinha] │
│  Resumo: pendente | pago | total                               │
├────────────────────────────────────────────────────────────────┤
│  Tabela / cards com ordenação e link para detalhe               │
└────────────────────────────────────────────────────────────────┘
```

---

## Plano de Execução — Fases

### Fase 1 — Fundação (API + hooks + remoção de cache global)
- [x] Criar `src/features/caixinha/api/caixinha.api.ts` e `caixinha.types.ts`
- [x] Migrar funções de `api.service.ts` relacionadas a Caixinha (e módulos `api/caixinhas`, `caixinhas-disponiveis`, `meus-emprestimos`, `analise-caixinha`) para a nova API
- [x] Remover ou isolar `state.cache` para esses endpoints; usar SWR
- [x] Limpar `debugger` / interceptor adequado (log só em dev, mensagens mapeadas)
- [x] Hooks: `useMinhasCaixinhas`, `useMeusEmprestimos`, `useExtrato`, `useEmprestimoDetail`, `useAnaliseCaixinha` (+ `useCaixinhasCatalog`, `useUltimoEmprestimoPendente`, `useMeusPagamentos`)

**Entregável:** mesmas telas consumindo hooks; comportamento de cache previsível.

### Fase 2 — Contexto de caixinha
- [x] `CaixinhaProvider` + hook `useCaixinhaContext`
- [x] Remover `window.location.reload()` de `useCaixinhaSelect`
- [x] Atualizar `ApplicationSelectCaixinha` para disparar `mutate` nas chaves afetadas (via `invalidateCaixinhaScopedQueries` no `setCaixinha` do contexto)

### Fase 3 — Hub `/caixinha/[id]`
- [x] Nova rota com resumo e CTAs
- [x] Redirecionar home / drawer para o hub quando `id` conhecido
- [x] Trecho de análise no hub (cards + últimas movimentações); link para análise completa + botão na página de análise

### Fase 4 — Catálogo e join
- [x] Paginação client-side em `/caixinhas-disponiveis` (6 por página)
- [x] Join com toast + navegação para `/caixinha/[id]` após entrar
- [x] Empty state quando `?id` inválido (join) e lista vazia na busca

### Fase 5 — Depósito e empréstimo
- [ ] Unificar UX (drawer ou página com mesmos subcomponentes)
- [x] Estados de loading no upload (comprovante) e feedback do PIX; toast com dismiss em erro
- [x] `POST /api/caixinha/emprestimo` (BFF): código `CAIXINHA_EMPRESTIMO_CODE` / `EMPIRESTIMO_API_CODE` só no servidor; browser chama a rota Next (`doEmprestimo`)

### Fase 6 — Extrato
- [x] Corrigir navegação de erro (`/error`)
- [x] Sincronizar filtros com URL (`meu`, `dep`, `emp` + `id`)
- [x] Skeleton por linhas (tabela visível com placeholders)

### Fase 7 — Meus empréstimos e detalhe
- [x] Filtro por texto (uid, nome, descrição, valor, caixinha) no painel lateral
- [x] Layout responsivo: `useMediaQuery` + abrir painel em `lg+`
- [x] Detalhe: código no título a partir de `emprestimo.uid` (8 primeiros caracteres)
- [x] Rota `/detalhes-emprestimo/[uid]` (+ links atualizados)

### Fase 8 — Renegociação
- [x] Stepper + `LinearProgress` + toasts com id; botão desabilitado durante solicitação; `Alert` em erro
- [x] Tipos `SolicitarRenegociacaoResponse` / `RenegociacaoSugestao`; `PropostaRenegociacao` tipada

### Fase 9 — Polimento
- [x] i18n: passos do stepper (`renegociacao.passo_*`)
- [x] Acessibilidade: label + `aria-label` no seletor de caixinha (topo)
- [ ] Revisão mobile ponta a ponta (manual)

---

## Decisões Técnicas

### Cache: SWR
Já está no `package.json`; alinha com o plano da Carteira e evita `Map` global no servidor Node (reutilização entre usuários em ambientes compartilhados).

### Onde não colocar segredos
Qualquer `code` de API embutido em `doEmprestimo` deve migrar para **Route Handler** ou **server action** que chama o backend com credencial de servidor.

### Modais vs páginas
| Fluxo | Hoje | Proposto |
|-------|------|----------|
| Depósito | Página | Drawer do hub ou página com shared form |
| Empréstimo | Página | Idem |
| Join | Página | Manter ou modal no catálogo |
| Detalhe empréstimo | Página + query | Página dinâmica + dados via hook |

### Tratamento de erro
- Hook `useCaixinhaError` ou helper que mapeia resposta Axios → mensagem amigável
- Sem `debugger` em fluxos de usuário

---

## Métricas de Sucesso
- Zero reload completo ao trocar caixinha
- Nenhuma chave de cache compartilhada entre usuários no servidor
- Redução de chamadas duplicadas ao abrir o menu (dedup SWR)
- Tempo percebido menor com skeletons em listas longas (extrato, empréstimos)
- Remoção de credenciais expostas no cliente no fluxo de empréstimo

---

## Arquivos a Deprecar ou Encurtar Após Refatoração
- Trechos de Caixinha em `src/pages/api/api.service.ts` → delegar para `features/caixinha/api`
- `state.cache` em `src/pages/api/caixinhas/index.ts`, `caixinhas-disponiveis/index.ts`, `meus-emprestimos/index.ts`
- Lógica duplicada de fetch em páginas → apenas hooks + componentes em `features/caixinha/components`

---

*Documento gerado em 20/03/2026*
