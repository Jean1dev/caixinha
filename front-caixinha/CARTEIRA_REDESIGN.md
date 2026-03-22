# Plano de Redesign — Carteira de Investimentos

## Contexto Atual

### Stack Técnica
- **Next.js** 16.1.5 / **React** 18.2.0 / **TypeScript**
- **MUI** v5 para UI
- **ApexCharts** para gráficos
- **Axios** para requisições HTTP
- **Next-Auth** para autenticação
- **i18next** para internacionalização

### Rotas Existentes
| Rota | Função |
|------|--------|
| `/carteira` | Dashboard principal |
| `/carteira/nova-carteira` | Wizard de criação |
| `/carteira/novo-ativo` | Adicionar ativo |
| `/carteira/aporte` | Novo aporte |
| `/carteira/meus-ativos` | Listagem de ativos |

### APIs Consumidas (CARTEIRA_SERVICE)
| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `GET /carteira?user=&email=` | GET | Buscar carteiras do usuário |
| `POST /carteira` | POST | Criar carteira |
| `POST /carteira/consolidar/{id}` | POST | Consolidar carteira |
| `POST /carteira/novo-aporte/{id}` | POST | Calcular aporte |
| `GET /carteira/distribuicao-por-meta/{id}` | GET | Distribuição por meta |
| `GET /carteira/meus-ativos` | GET | Listar ativos paginado |
| `POST /ativo` | POST | Criar ativo |
| `PUT /ativo` | PUT | Atualizar ativo |
| `DELETE /ativo/{id}` | DELETE | Remover ativo |
| `GET /ativo/tipo-ativos` | GET | Tipos de ativo |
| `GET /ativo/sugestao?query=` | GET | Sugestão de ativos |
| `GET /criterio?tipo=` | GET | Critérios por tipo |
| `GET /carteira/meta?tipo=` | GET | Metas prontas |
| `GET /quote` | GET | Cotações para ticker |

### Problemas Identificados no Código Atual
1. **Estado local disperso** — cada página gerencia estado independentemente sem cache
2. **API calls repetidas** — `getMinhasCarteiras` chamado em múltiplas páginas sem cache
3. **Componentes monolíticos** — lógica de negócio misturada com apresentação
4. **Zero feedback de carregamento** — skeletons/placeholders ausentes
5. **Navegação fragmentada** — experiência quebrada entre páginas
6. **Sem tratamento de erro consistente** — erros tratados ad-hoc por componente
7. **Wizard de criação perde contexto** — sem persistência local de rascunho
8. **Tabela de ativos sem UX moderna** — sem sorting, sem bulk actions

---

## Visão da Nova Experiência

### Filosofia de Design
- **Single Page Feel** — menos navegação entre páginas, mais modais e drawers contextuais
- **Data First** — mostrar dados imediatamente com skeleton loading
- **Ações inline** — editar, aportar e excluir sem sair da tela atual
- **Hierarquia visual clara** — carteira → tipo de ativo → ativo individual

### Mapa de Telas Redesenhadas

```
/carteira
  ├── Dashboard (redesenhado — layout em painéis)
  │   ├── Painel Esquerdo: Resumo geral + seletor de carteira
  │   ├── Painel Central: Gráfico de distribuição interativo
  │   └── Painel Direito: Feed de cotações + ações rápidas
  │
  ├── /carteira/[id]            (NOVA) — Detalhes de uma carteira
  │   ├── Header com nome, patrimônio total e variação
  │   ├── Tabs: Ativos | Distribuição | Histórico | Configurações
  │   └── Ações: Aportar | Consolidar | Editar
  │
  ├── /carteira/nova-carteira   (refatorado — wizard mantido, UX melhorada)
  ├── /carteira/meus-ativos     (refatorado — tabela mais rica)
  └── Modais contextuais:
      ├── Drawer: Adicionar ativo
      ├── Drawer: Novo aporte
      └── Dialog: Confirmar exclusão
```

---

## Arquitetura Proposta

### 1. Estrutura de Arquivos

```
src/
├── pages/
│   └── carteira/
│       ├── index.tsx                    # Dashboard principal
│       ├── [id].tsx                     # (NOVA) Detalhe da carteira
│       ├── nova-carteira/
│       │   └── index.tsx                # Wizard refatorado
│       └── meus-ativos/
│           └── index.tsx                # Listagem refatorada
│
├── features/
│   └── carteira/                        # (NOVA) Feature folder
│       ├── api/
│       │   ├── carteira.api.ts          # Chamadas à API (extraídas de api.carteira.ts)
│       │   └── carteira.types.ts        # Tipos TypeScript específicos do domínio
│       │
│       ├── hooks/
│       │   ├── useCarteiras.ts          # Hook com cache de carteiras
│       │   ├── useCarteiraDetail.ts     # Hook de detalhe de uma carteira
│       │   ├── useAtivos.ts             # Hook de ativos com filtros
│       │   ├── useAporte.ts             # Hook de cálculo e execução de aporte
│       │   └── useTipoAtivos.ts         # Hook para tipos de ativo (cache estático)
│       │
│       ├── components/
│       │   ├── dashboard/
│       │   │   ├── CarteiraDashboard.tsx         # Orquestrador do dashboard
│       │   │   ├── CarteiraSelector.tsx          # Seletor de carteira com badge
│       │   │   ├── PatrimonioTotalCard.tsx        # Card de patrimônio total
│       │   │   ├── DistribuicaoChart.tsx          # Gráfico donut interativo
│       │   │   ├── ResumoMercado.tsx              # TradingView widget
│       │   │   └── QuotesTicker.tsx               # Ticker infinito de cotações
│       │   │
│       │   ├── detalhe/
│       │   │   ├── CarteiraDetalheHeader.tsx      # Header com patrimônio
│       │   │   ├── CarteiraDetailTabs.tsx         # Tabs de navegação
│       │   │   ├── AtivosTab.tsx                  # Tab de ativos
│       │   │   ├── DistribuicaoTab.tsx            # Tab de distribuição
│       │   │   └── ConfiguracaoTab.tsx            # Tab de configurações
│       │   │
│       │   ├── ativos/
│       │   │   ├── AtivosTable.tsx                # Tabela principal (refatorada)
│       │   │   ├── AtivoRow.tsx                   # Linha inline editável
│       │   │   ├── AtivosFilters.tsx              # Filtros (chips + dropdowns)
│       │   │   ├── AtivoFormDrawer.tsx            # Drawer add/edit ativo
│       │   │   └── AtivoDeleteConfirm.tsx         # Dialog de confirmação
│       │   │
│       │   ├── aporte/
│       │   │   ├── AporteDrawer.tsx               # Drawer principal de aporte
│       │   │   ├── AporteCalculoResult.tsx        # Resultado do cálculo
│       │   │   └── AporteAtivoCard.tsx            # Card de ativo recomendado
│       │   │
│       │   ├── nova-carteira/
│       │   │   ├── NovaCarteiraWizard.tsx         # Orquestrador do wizard
│       │   │   ├── WizardStep1Nome.tsx            # Passo 1: nome
│       │   │   ├── WizardStep2Perfil.tsx          # Passo 2: perfil
│       │   │   ├── WizardStep3Ativos.tsx          # Passo 3: ativos iniciais
│       │   │   └── WizardProgressBar.tsx          # Barra de progresso
│       │   │
│       │   └── shared/
│       │       ├── TipoAtivoChip.tsx              # Chip colorido por tipo
│       │       ├── NotaDisplay.tsx                # Exibição de nota 1-10
│       │       ├── ValorMonetario.tsx             # Formatação de valor BRL
│       │       └── CarteiraEmptyState.tsx         # Estado vazio com CTA
│
└── lib/
    └── cache/
        └── query-client.ts              # Configuração do cache client-side
```

### 2. Estratégia de Cache

#### Cache Client-Side com `useSWR` ou React Query
Utilizar **SWR** (já presente em projetos Next.js como dependência transitiva) ou introduzir **React Query (TanStack Query)** para gerenciar cache de dados.

**Configuração de TTL por endpoint:**

| Dado | TTL | Estratégia |
|------|-----|-----------|
| Lista de carteiras | 30s | SWR revalidate on focus |
| Detalhe da carteira | 60s | Cache + background refresh |
| Tipos de ativo | 1h | Cache estático, sem revalidação |
| Metas prontas | 1h | Cache estático |
| Cotações (quotes) | 10s | Polling ativo |
| Ativos (paginado) | 30s | Cache por chave (page + filtros) |
| Distribuição por meta | 60s | Invalidar após aporte |

**Exemplo de hook com cache:**
```typescript
// features/carteira/hooks/useCarteiras.ts
import useSWR from 'swr'

export function useCarteiras() {
  const { user, email } = useUserAuth()

  const { data, error, isLoading, mutate } = useSWR(
    user ? ['carteiras', user, email] : null,
    () => getMinhasCarteiras(user, email),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,  // 30s
    }
  )

  return {
    carteiras: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  }
}
```

#### Invalidação de Cache
- Após **criar carteira** → invalidar `carteiras`
- Após **criar/editar/deletar ativo** → invalidar `ativos` e `distribuicao`
- Após **aporte** → invalidar `distribuicao` e `ativos`
- Após **consolidar** → invalidar carteira específica

### 3. Separação de Responsabilidades

#### Antes (padrão atual)
```
Page Component
  ├── useState (dados)
  ├── useEffect (fetch)
  ├── handlers (lógica de negócio)
  └── JSX (apresentação + lógica misturados)
```

#### Depois (padrão proposto)
```
Page Component (apenas orquestração e layout)
  └── Feature Components
        └── Custom Hooks (dados + lógica)
              └── API Layer (chamadas HTTP puras)
```

---

## Redesign de UX — Wireframes Conceituais

### Dashboard Principal (`/carteira`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Carteira de Investimentos                    [+ Nova Carteira]  │
├──────────────┬──────────────────────────────┬───────────────────┤
│              │                              │                   │
│  CARTEIRAS   │    DISTRIBUIÇÃO ATUAL        │  COTAÇÕES AO VIVO │
│  ─────────   │    ─────────────────────     │  ──────────────── │
│              │         [DONUT]              │  PETR4  +2.3%  ↑  │
│  ● Carteira  │    Renda Fixa    45%         │  VALE3  -0.8%  ↓  │
│    Principal │    Ações BR      30%         │  BTC    +1.2%  ↑  │
│    R$ 45k    │    FIIs          15%         │  ...              │
│              │    Cripto        10%         │                   │
│  ● Previdên- │                              │  [RESUMO MERCADO] │
│    cia        │    Patrimônio Total:        │                   │
│    R$ 12k    │    R$ 57.432,00             │                   │
│              │                              │  [APORTAR]        │
│  [+] Criar   │    [Consolidar] [Aportar]   │  [+ ATIVO]        │
│              │                              │                   │
└──────────────┴──────────────────────────────┴───────────────────┘
```

### Página de Detalhe da Carteira (`/carteira/[id]`)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Carteira Principal        R$ 45.230,00    [Aportar] [⚙️]     │
├─────────────────────────────────────────────────────────────────┤
│  [Ativos]  [Distribuição]  [Histórico]  [Configurações]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ATIVOS                                      [Buscar] [Filtros]  │
│  ─────────────────────────────────────────────────────────────  │
│  Tipo      Nome          Qtd    Valor      Nota    Ações         │
│  ────────  ─────────────  ───    ─────────  ──────  ──────────   │
│  AÇÃO      PETR4          100   R$ 2.800    ⭐⭐⭐⭐   [✏️][🗑️]  │
│  FII       KNRI11          10   R$ 1.250    ⭐⭐⭐⭐⭐  [✏️][🗑️]  │
│  CRIPTO    BTC             0.5  R$ 25.000   ⭐⭐⭐    [✏️][🗑️]  │
│  ...                                                             │
│                                                                  │
│  [+ Adicionar Ativo]                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Drawer de Aporte

```
┌────────────────────────────┐
│  Novo Aporte          [✕]  │
│  ──────────────────────── │
│  Carteira: Principal ▼     │
│                            │
│  Valor: R$ [_________]    │
│                            │
│  [Calcular Distribuição]   │
│  ──────────────────────── │
│  Recomendações:            │
│                            │
│  PETR4     R$ 420    [✓]  │
│  KNRI11    R$ 280    [✓]  │
│  BTC       R$ 300    [✓]  │
│                            │
│  [Aplicar Aportes]         │
└────────────────────────────┘
```

---

## Plano de Execução — Fases

### Fase 1 — Fundação (Infraestrutura de Cache e API)
**Objetivo**: Criar a base sólida antes de qualquer UI

- [ ] Instalar dependência: `swr` (ou `@tanstack/react-query`)
- [ ] Criar `src/features/carteira/api/carteira.api.ts` — extrair e organizar todas as funções de API de `api.carteira.ts`
- [ ] Criar `src/features/carteira/api/carteira.types.ts` — centralizar todos os tipos do domínio
- [ ] Criar hooks com cache:
  - `useCarteiras.ts`
  - `useCarteiraDetail.ts`
  - `useAtivos.ts`
  - `useTipoAtivos.ts`
  - `useAporte.ts`
- [ ] Configurar estratégia de invalidação de cache entre hooks

**Entregável**: Dados fluindo via hooks com cache, sem mudança visual

---

### Fase 2 — Componentes Compartilhados
**Objetivo**: Criar os building blocks reutilizáveis

- [ ] `TipoAtivoChip` — chip colorido por tipo (AÇÃO=azul, FII=verde, CRIPTO=laranja, etc.)
- [ ] `NotaDisplay` — 5 estrelas ou barra de nota 1-10
- [ ] `ValorMonetario` — formatação BRL consistente
- [ ] `CarteiraEmptyState` — estado vazio com CTA
- [ ] Skeleton loaders para cada seção (CarteiraSkeleton, AtivosSkeleton)

---

### Fase 3 — Redesign do Dashboard Principal
**Objetivo**: Nova experiência no `/carteira`

- [ ] Layout em 3 painéis (sidebar de carteiras | gráfico central | feed lateral)
- [ ] `CarteiraSelector` — lista de carteiras com patrimônio e badge de ativos
- [ ] `PatrimonioTotalCard` — total consolidado de todas as carteiras
- [ ] `DistribuicaoChart` — gráfico donut interativo com tooltip rico
- [ ] `QuotesTicker` — refatoração do InfiniteSlide com melhor performance
- [ ] Responsividade mobile: colapsar para single column

---

### Fase 4 — Página de Detalhe da Carteira (NOVA)
**Objetivo**: Criar `/carteira/[id]` com experiência completa

- [ ] Rota dinâmica `[id].tsx`
- [ ] `CarteiraDetalheHeader` — patrimônio, botões de ação
- [ ] `CarteiraDetailTabs` — Ativos | Distribuição | Configurações
- [ ] Tab de Ativos com tabela inline editável
- [ ] Tab de Distribuição com gráfico detalhado
- [ ] Tab de Configurações (nome, perfil, consolidar, excluir)

---

### Fase 5 — Ativos: Tabela e Formulários
**Objetivo**: Refatorar Meus Ativos e transformar Novo Ativo em Drawer

- [ ] `AtivosTable` — tabela com sorting, linha inline editável
- [ ] `AtivoRow` — linha com estado de edição inline
- [ ] `AtivosFilters` — filtros com chips visuais
- [ ] `AtivoFormDrawer` — drawer lateral para add/edit (substitui página `/novo-ativo`)
- [ ] `AtivoDeleteConfirm` — dialog de confirmação com nome do ativo

---

### Fase 6 — Aporte como Drawer
**Objetivo**: Transformar a experiência de aporte em drawer contextual

- [ ] `AporteDrawer` — drawer principal com input de valor e carteira
- [ ] `AporteCalculoResult` — seção de resultados do cálculo
- [ ] `AporteAtivoCard` — card individual com checkbox para selecionar
- [ ] Integração com cache: invalidar distribuição após aporte

---

### Fase 7 — Wizard de Nova Carteira Refatorado
**Objetivo**: Manter o wizard com UX melhorada e persistência de rascunho

- [ ] Persistir rascunho no localStorage (não perder ao recarregar)
- [ ] Visual do wizard mais moderno (steps como timeline vertical)
- [ ] Step 2 com cards visuais de perfil (não só radio buttons)
- [ ] Feedback de sucesso inline (sem redirecionar para `/sucesso`)

---

### Fase 8 — Polimento e Responsividade
- [ ] Revisão de responsividade em todas as telas (mobile first)
- [ ] Testes de loading states e error states em todos os componentes
- [ ] Animações suaves com CSS transitions (não bibliotecas extras)
- [ ] Revisão de acessibilidade (aria-labels, keyboard navigation)

---

## Decisões Técnicas

### Biblioteca de Cache
**Escolha: SWR** (da Vercel, nativa ao ecossistema Next.js)
- Sem dependência extra se já disponível
- API simples baseada em hooks
- Suporte nativo a revalidação, polling e mutação otimista

**Alternativa: TanStack React Query** se maior controle for necessário (DevTools, cache granular)

### Modais vs Páginas
| Ação | Antes | Depois |
|------|-------|--------|
| Adicionar ativo | Página `/novo-ativo` | Drawer lateral |
| Novo aporte | Página `/aporte` | Drawer lateral |
| Editar ativo | Modal simples | Linha inline na tabela |
| Criar carteira | Página `/nova-carteira` | Mantida como página (fluxo complexo) |

### Tipagem
- Centralizar todos os tipos em `features/carteira/api/carteira.types.ts`
- Remover duplicações entre `types.ts` e definições inline nos componentes
- Usar tipos específicos por request/response (ex: `CreateAtivoRequest`, `AtivoResponse`)

### Tratamento de Erro
- Criar um `ErrorBoundary` específico para o módulo de carteira
- Padronizar mensagens de erro com mapeamento de status HTTP → mensagem amigável
- Centralizar em um hook `useCarteiraError` ou em um interceptor Axios dedicado

---

## Métricas de Sucesso
- Redução de re-renders desnecessários (memoização dos hooks)
- Dados disponíveis instantaneamente ao navegar entre carteiras (via cache SWR)
- Zero chamadas duplicadas à API na mesma sessão para dados estáticos (tipos de ativo, metas)
- Tempo até interatividade (TTI) menor no dashboard principal

---

## Arquivos a Remover/Deprecar Após Refatoração
- `src/pages/carteira/novo-ativo/index.tsx` → substituído por drawer
- `src/pages/carteira/aporte/index.tsx` → substituído por drawer
- `src/components/carteira/novo-ativo/` → movido para `features/carteira/components/ativos/`
- `src/components/carteira/nova-carteira-form.tsx` → movido para `features/`
- Referências diretas a `api.carteira.ts` nos componentes → usar hooks

---

*Documento gerado em 19/03/2026*
