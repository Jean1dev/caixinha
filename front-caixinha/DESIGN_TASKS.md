# Redesign Tasks — Caixinha (Indigo)

Fonte de design: `caixinha-repaginada/project/Caixinha - Telas (Indigo).html`
Paleta principal: indigo `#6366F1`, fundo branco, tipografia Plus Jakarta Sans + Inter.
Raio de card: 20px | sombra: `0 5px 22px rgba(0,0,0,0.08)` | botão: radius 12px.

> **Regra geral:** antes de alterar qualquer tela, ler TODA a página e seus componentes filhos.
> Nunca quebrar lógica de negócio — só alterar a camada visual (layout, espaçamentos, cores, tipografia).
> Manter todos os hooks, handlers, chamadas de API e navegação intactos.

---

## Status

| # | Tela | Arquivo | Status |
|---|------|---------|--------|
| 01 | Home / Dashboard | `src/pages/index.tsx` | ✅ concluído |
| 02 | Caixinhas disponíveis | `src/pages/caixinhas-disponiveis/index.tsx` | ✅ concluído |
| 03 | Minha Caixinha (detalhe) | `src/pages/caixinha/[id].tsx` | ✅ concluído |
| 04 | Empréstimo | `src/pages/emprestimo/index.tsx` | ✅ concluído |
| 05 | Depósito | `src/pages/deposito/index.tsx` | ✅ concluído |
| 06 | Extrato | `src/pages/extrato/index.tsx` | ✅ concluído |
| 07 | Feed | `src/pages/feed/index.tsx` | ✅ concluído |
| 08 | Onboarding / Boas-vindas (gate deslogados) | `src/components/bem-vindo/onboarding.tsx` + `src/pages/index.tsx` | ✅ concluído |
| 09 | Meus empréstimos (master-detail) | `src/pages/meus-emprestimos/index.tsx` | ✅ concluído |
| 10 | Menu lateral (Drawer indigo) | `src/components/Drawer.tsx` | ✅ concluído |

---

## TASK-08 — Onboarding / Boas-vindas

**Arquivos:** `src/components/bem-vindo/onboarding.tsx` (novo), `src/pages/index.tsx` (gate).
Ref. design: `indigo/new-screens.jsx → OnboardingScreen`.

- Tela standalone (fora do `Layout`, com `ThemeProvider` indigo próprio) mostrada quando `useSession().status === 'unauthenticated'`.
- Card 880px: painel esquerdo com `person-standing.png` + pill "CapiCoin chegou"; direito com logo, título "Bem-vindo à Caixinha!", 3 features e CTAs.
- CTAs "Começar agora" / "Já tenho conta" → `signIn()` (fluxo next-auth preservado).
- Logado: Home dashboard intacta. Loading: `CenteredCircularProgress`.

## TASK-09 — Meus empréstimos (master-detail)

**Arquivo:** `src/pages/meus-emprestimos/index.tsx`.
Ref. design: `indigo/meus-emprestimos.jsx`. Novos componentes em `src/components/meus-emprestimos/`:
`stat-card.tsx`, `emprestimo-list-item.tsx`, `emprestimo-detail.tsx`, `loan-progress.tsx`, `loan-status.tsx`.
Util novo: `src/features/caixinha/utils/flatten-emprestimos.ts` (mapeia `LoansForApprove` → view-model + status).

- 3 `StatCard` (Total emprestado = `totalGeral`, Em aberto = nº não-quitados, Pendente aprovação = `totalPendente`).
- Grid `360px minmax(0,1fr)`: lista de cards clicáveis + busca à esquerda, `EmprestimoDetail` à direita.
- Mobile (`< lg`): só a lista; clique navega para `/detalhes-emprestimo/{uid}`.
- Preservado: `useMeusEmprestimos`, `filterMeusEmprestimos`, loading/error (`/error`), navegação real
  ("Pagar parcela"/"Ver detalhes" → `/detalhes-emprestimo/{uid}`, "Renegociar" → `/renegociacao`, "Novo empréstimo" → `/emprestimo`).
- Componentes antigos (`filtros`, `meus-emprestimos-table`, `meus-emprestimos-list-summary`, `meu-emprestimos-list-container`) deixaram de ser referenciados (não deletados).

## TASK-10 — Menu lateral (Drawer indigo)

**Arquivo:** `src/components/Drawer.tsx`.
Ref. design: `indigo/shell.jsx → Drawer/DrawerItem`.

- Header com avatar `primary.light` + `capicoin.png` + wordmark "Caixinha".
- Itens `borderRadius 12`, item da rota atual (via `router.pathname`) destacado (`primary.light` / `primary.dark`), hover suave, chips New/Beta à direita.
- Preservado: todas as rotas/hrefs, `CustomChips`, item condicional `caixinha?.id` → "Minha caixinha", `open`/`handleDrawerClose`.

---

## TASK-01 — Home / Dashboard

**Arquivo:** `src/pages/index.tsx`

### Design alvo (indigo/screens.jsx → `HomeScreen`)
- Título h3 "Bem-vindo à Caixinha!" centralizado, fontWeight 700, fontSize 34.
- Primeira linha: `BannerNovidades` (1.4fr) + `Dicas` (1fr) com `gap: 24px` — ambos stretching em altura.
- Segunda linha: grid `repeat(auto-fit, minmax(240px, 1fr))` com 4 `GradientCard`s:
  - "Minha caixinha" → `/caixinha/{id}` (só aparece se `caixinha?.id` existir)
  - "Caixinhas" → `/caixinhas-disponiveis`
  - "Depositar" → `/deposito`
  - "Pedir empréstimo" → `/emprestimo`
- Cada GradientCard: gradiente indigo do array `GRADIENTS`, ícone MUI 36px branco, título h5 branco, descrição body2 branco, hover `translateY(-4px) scale(1.03)`.

### Funcionalidade a preservar
- `useCaixinhaSelect()` → `caixinha` (card "Minha caixinha" só renderiza se `caixinha?.id` existir).
- `useUltimoEmprestimoPendente()` → quando `ultimoEmprestimoAtalho?.exists` é true, substituir o card `Dicas` por `AtalhoEmprestimo`.
- `useSettings()` → `settings.stretch` para `Container maxWidth`.
- `useTranslation()` → textos i18n nos cards.
- Toda navegação `router.push(...)` deve continuar funcionando.

### O que mudar
- Substituir o Grid `md={7}` / `md={5}` por `gridTemplateColumns: '1.4fr 1fr'` com CSS grid nativo (ou MUI Box com `display:'grid'`).
- Substituir os cards individuais em `Grid xs={12} md={7}` por um grid `repeat(auto-fit,minmax(240px,1fr))`.
- Atualizar o estilo dos cards inline para usar a paleta indigo e o array de gradientes existente `corAleatoriaCombinada()`.
- Trocar ícones MUI `SvgIcon` por ícones inline dentro do card (já existe `DashboardIcon`, `SavingsIcon` etc — mantê-los).
- `py: 8` → `padding: '40px 24px 64px'` (ou equivalente).

---

## TASK-02 — Caixinhas disponíveis

**Arquivo:** `src/pages/caixinhas-disponiveis/index.tsx`

### Design alvo (indigo/screens.jsx → `CaixinhasScreen`)
- Overline "Comunidade" (fontSize 12, uppercase, letterSpacing 0.5px, cor textSecondary).
- Título h4 "Caixinhas disponíveis", fontWeight 700, fontSize 28.
- Grid `repeat(auto-fill, minmax(260px, 1fr))` gap 24px.
- Cada `CaixinhaCard`: header colorido 140px (gradiente), valor em destaque, nome, footer com "Detalhes" + contador de membros + botão "Participar".

### Funcionalidade a preservar
- `useCaixinhasCatalog()` → `{ catalog, isLoading, error }`.
- `filterCaixinhasByQuery(catalog, query)` → `data`.
- Paginação por `PAGE_SIZE = 6` com `Pagination`.
- `CaixinhaSearch` → campo de busca.
- `CenteredCircularProgress` no loading.
- `router.push('/error')` no erro.

### O que mudar
- Remover o wrapper duplo `Paper` externo.
- Substituir o título `Typography variant="h3"` por overline + h4 alinhados à esquerda.
- Substituir o `Paper` ao redor do grid por um `Box` simples.
- Mover `CaixinhaSearch` para above the grid, sem Paper wrapper extra.
- Ajustar o `CaixinhaCard` existente em `src/components/caixinha/CaixinhaCard.tsx` para ter header colorido 140px e footer com layout do design (ler o componente antes de alterar).

---

## TASK-03 — Minha Caixinha (detalhe)

**Arquivo:** `src/pages/caixinha/[id].tsx`

### Design alvo (indigo/screens-extra.jsx → `MinhaCaixinhaScreen`)
- Overline "Minha caixinha", título h4 com nome da caixinha, fontWeight 700.
- 3 `StatCard`s em grid `repeat(auto-fit, minmax(230px, 1fr))`:
  - Saldo da caixinha (com `difference` do CDI, ícone savings).
  - Participantes (sem delta).
  - Empréstimos ativos (com delta negativo se houver).
- Barra de ações: botão "Depositar" (contained), "Pedir empréstimo" (outlined), "Extrato" (text), "Análise completa" (text).
- `UltimasMovimentacoes` / `ExtratoTable` abaixo.

### Funcionalidade a preservar
- Todas as verificações de autenticação (`sessionStatus === 'unauthenticated'`).
- Verificação de `!mine` (usuário não participa).
- `useMinhasCaixinhas()`, `useAnaliseCaixinha()`, `useCaixinhaContext()`.
- Toda a lógica de `saldoFromCaixinha(c)`.
- Botões com `component={Link}` preservando hrefs e query params.
- `CenteredCircularProgress` nos estados de loading.

### O que mudar
- Substituir os 4 `CardTotal` por `StatCard` com estilo do design (Avatar 56px com ícone, overline, valor em fontSize 30, delta opcional).
- Ajustar tipografia do título para overline + h4.
- Remover o botão "Início" (`ArrowBackIos`) e colocá-lo como link discreto acima do overline.
- Ajustar o layout dos botões de ação para `display: flex, gap: 12, flexWrap: wrap`.

---

## TASK-04 — Empréstimo

**Arquivo:** `src/pages/emprestimo/index.tsx`

### Design alvo (indigo/screens-extra.jsx → `EmprestimoScreen`)
- Layout 2 colunas `minmax(0,1fr) minmax(0,1fr)` gap 24.
- Card esquerdo — formulário visual:
  - Overline "Valor solicitado" + valor grande em `#6366F1` (fontSize 30, fontWeight 700).
  - Slider `input[type=range]` min=100 max=5000 step=100, accentColor indigo.
  - Overline "Parcelamento" + 4 botões (2x / 3x / 6x / 12x) com borda indigo quando selecionado.
  - Campo de texto "Motivo" (já existe).
- Card direito — resumo:
  - Título "Resumo".
  - Linhas: Valor solicitado / Taxas / Juros.
  - Divisor + Total a pagar em destaque indigo.
  - Linha "N× de R$ X".
  - Botão "Solicitar empréstimo" (full, large, contained).

### Funcionalidade a preservar
- `doEmprestimo({ ...solicitacao, motivo, caixinhaID })` → `router.push('/sucesso')`.
- `getValorParcelas({ parcelas, total })` → `stateParcelas`.
- `useUserAuth()` para `user.name` e `user.email` no state.
- `useCaixinhaSelect()` para `caixinha?.id` e `caixinha?.name`.
- `toast.error(err.message)` no catch.
- `CenteredCircularProgress` no isLoading.

### O que mudar
- Substituir `OutlinedInput` de valor por slider + display de valor grande.
- Substituir `OutlinedInput` de parcela por botões selecionáveis (mantendo o state `solicitacao.parcela`).
- Manter `OutlinedInput` de juros (necessário pois o backend precisa) — pode ficar como campo secundário ou dentro do resumo.
- Manter campo de motivo como `OutlinedInput multiline`.
- O cálculo de total/parcela do design é local (visual) — o real vem de `getValorParcelas`, que deve continuar sendo chamado.

---

## TASK-05 — Depósito

**Arquivo:** `src/pages/deposito/index.tsx`

### Design alvo (indigo/new-screens.jsx → `DepositoScreen`)
- Layout 2 colunas `minmax(0,1.3fr) minmax(0,1fr)`.
- Card esquerdo:
  - Select "Depositar na caixinha" (somente visual — caixinha já vem do context, manter readonly ou disabled).
  - Input de valor com "R$" em destaque (fontSize 30 fontHead) + borda indigo.
  - 4 botões rápidos: +R$50 / +R$100 / +R$200 / +R$500.
  - 3 botões de método de pagamento (Pix / Cartão / Boleto) com radio visual.
  - Upload de comprovante (mantido como está, mas com visual melhorado).
- Card direito — resumo sticky:
  - Linhas: Caixinha / Valor / Taxa.
  - Divisor + Total em indigo.
  - Badge verde "Transação protegida".
  - Botão "Depositar R$ X" (full, large, contained).
- QR Code PIX: manter mas posicionar abaixo dos métodos ou como modal (não remover).

### Funcionalidade a preservar
- `doDeposito({ caixinhaId, name, email, valor, comprovante })` → `router.push('/sucesso/deposito')`.
- `getChavesPix(caixinha.id)` → `pix.chave` e `pix.url` (QR code).
- `uploadResource(file)` → `solicitacao.fileUrl`.
- `getBuckets()` chamado no mount.
- Chips de comprovante com status de upload.
- `toast.loading / toast.success / toast.error`.
- `useUserAuth()` → memberName / email (disabled).
- `useCaixinhaSelect()` → caixinha.

### O que mudar
- Substituir layout 2-coluna atual por grid com proporção 1.3fr / 1fr.
- Adicionar botões de valor rápido (+50/+100/+200/+500) acima do campo valor.
- Adicionar seletor visual de método de pagamento.
- Colocar QR Code PIX como expansível dentro da opção "Pix" selecionada.
- Card de resumo com badge de proteção + botão CTA.
- Remover campo "Mensagem" (não é enviado ao backend).

---

## TASK-06 — Extrato

**Arquivo:** `src/pages/extrato/index.tsx`

### Design alvo (indigo/screens-extra.jsx → `ExtratoTable` + `ExtratoScreen`)
- Overline "Movimentações", título h4 "Extrato".
- Filtros: chips de filtro mantidos, mas acima da tabela com layout mais discreto.
- Tabela com 5 colunas: Operação / Membro / Data / Valor / Status.
- Na coluna Operação: avatar 32px com ícone seta ↓ (verde, depósito) ou ↑ (laranja, empréstimo) + texto.
- Valor: cor verde para entradas (`+`), cor texto normal para saídas (`−`).
- Status: `Chip` soft (warning=Pendente, success=Concluído, primary=Quitado).
- Header de coluna: uppercase, fontSize 12, letterSpacing 0.5px, cor textSecondary.

### Funcionalidade a preservar
- `useExtrato(extratoParams)` → `{ linhas, isLoading, error }`.
- Filtros via `router.query` (meu/dep/emp/id) com `patchQuery`.
- `useSession()` para `user.name`.
- Skeleton loading com 8 linhas.
- `router.push('/error')` no erro.
- `Pagination` (mesmo que `count=1` por ora).
- `DisplayValorMonetario` para exibição de valores.

### O que mudar
- Substituir header da tabela por cells com estilo uppercase + letterSpacing.
- Na coluna Operação, adicionar avatar colorido com ícone (inferir tipo de `order.tipo`: "Depósito" → `arrow_downward` verde, "Empréstimo" → `arrow_upward` laranja).
- Na coluna Valor, colorir de verde quando entrada (quando `order.tipo === 'Depósito'`).
- Substituir o texto puro de status por `Chip` com cor dinâmica (success/warning/primary).
- Ajustar overline + título acima da tabela.
- Manter chips de filtro mas ajustar visual (gap, spacing).

---

## TASK-07 — Feed

**Arquivo:** `src/pages/feed/index.tsx`

### Design alvo (indigo/screens.jsx → `FeedScreen`)
- Container maxWidth 620.
- Overline "Social", título h4 "Feed", subtitle "Aqui está o que suas conexões postaram".
- Card compositor (textarea + botão "Publicar").
- Lista de `FeedPost` cards: avatar, nome, tempo, texto, chip de ativo (quando houver), botões curtir/comentar/compartilhar.

### Funcionalidade a preservar
- `getMeuFeed(username)` → `posts` com paginação via `page`.
- `loadMore()` → append de posts.
- `addCommentView(comment, postId)` → atualiza `posts` localmente.
- `useUserAuth()` para `user.name`, `user.photoUrl`, `user.email`.
- `SocialPostAdd` → manter componente de composição de posts (já tem submit para backend).
- `SocialPostCard` → manter, mas aplicar visual do design ao redor (Card wrapper).
- `hasMore` → botão "Carregar mais".
- `useTranslation()` para labels.

### O que mudar
- Reduzir `Container maxWidth="lg"` para `maxWidth="sm"` (ou Box maxWidth 620).
- Adicionar overline "Social" acima do título.
- Adicionar subtitle de texto secundário abaixo do título.
- `SocialPostCard` pode receber o visual de `FeedPost` — ler o componente antes de alterar.
- Ajustar `py: 8` para `padding: '40px 24px 64px'`.

---

## Componentes compartilhados a criar/ajustar

| Componente | Ação |
|-----------|------|
| `src/components/caixinha/CaixinhaCard.tsx` | Adicionar header colorido 140px + footer layout (TASK-02) |
| `src/components/analise-caixinha/card-total.tsx` | Avaliar se `StatCard` do design substitui ou coexiste (TASK-03) |

---

## Ordem sugerida de implementação

1. TASK-01 (Home) — mais visível, menor risco
2. TASK-02 (Caixinhas) — grid/cards, sem lógica complexa
3. TASK-06 (Extrato) — apenas visual da tabela
4. TASK-03 (Minha Caixinha) — stat cards + ações
5. TASK-04 (Empréstimo) — substituição de inputs por slider
6. TASK-05 (Depósito) — maior complexidade (QR + upload)
7. TASK-07 (Feed) — ajuste de container + overline
