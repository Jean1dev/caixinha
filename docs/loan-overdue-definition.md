# Definição técnica de empréstimo atrasado

## Regra canônica

Um empréstimo está atrasado quando a primeira parcela ainda não integralmente paga possui vencimento anterior ao dia atual em `America/Sao_Paulo`.

- Pagamentos são alocados cronologicamente, começando pela parcela mais antiga.
- Uma parcela parcialmente paga continua sendo a próxima parcela não quitada.
- Parcelas futuras não anulam o atraso de uma parcela anterior.
- Uma parcela que vence hoje ainda está em dia; o atraso começa no próximo dia civil.
- Empréstimos integralmente quitados não estão atrasados.

## Fonte de verdade

`caixinha-core` é a fonte canônica da decisão de negócio:

- `Loan.nextUnpaidBillingDate` informa a parcela relevante.
- `Loan.calculateOverdueDays()` calcula os dias de atraso.
- `Loan.isOverdue` decide se o empréstimo está atrasado.
- `Renegotiation.create()` usa a mesma decisão antes de permitir uma renegociação.
- `GenerateCreditRisk()` deve usar `Loan.isOverdue` e `Loan.calculateOverdueDays()` para empréstimos ativos. A data da última parcela não pode decidir se um empréstimo ativo está atrasado.

O histórico de um empréstimo integralmente quitado é uma análise diferente: ele pode registrar que a quitação ocorreu depois do vencimento final, mas nunca deve tornar o empréstimo elegível para renegociação.

O utilitário `caixinha-serverless/utils/loan-schedule.js` existe para montar valores e estados de apresentação das parcelas. Sua decisão `isOverdue` deve permanecer compatível com o core e é protegida por um teste de contrato. Novas regras de elegibilidade não devem ser implementadas somente nesse utilitário ou no frontend.

## Compatibilidade e publicação

Mudanças nessa definição devem seguir esta ordem:

1. alterar e testar a regra no `caixinha-core`;
2. publicar uma nova versão do pacote;
3. atualizar a versão em `caixinha-serverless`;
4. executar o teste de contrato e os testes dos endpoints consumidores;
5. somente então alterar rótulos ou filtros do frontend.

O fluxo de renegociação deve possuir um teste com mais de uma parcela, no qual a primeira parcela está vencida e a última ainda está no futuro. Esse caso de contrato impede consumidores de voltarem a usar `lastDayForPay` como definição de atraso ativo.

Isso evita que a interface classifique um empréstimo como atrasado enquanto cobrança ou renegociação aplicam outra definição.
