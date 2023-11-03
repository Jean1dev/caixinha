const middleware = require('../utils/middleware')
const { ObjectId } = require('mongodb')
const moment = require('moment')
const { connect, getByIdOrThrow, find, findOrderByDesc } = require("../v2/mongo-operations");

function groupElementsByMemberName(deposits) {
    const groupedElements = {};
    deposits.forEach(deposit => {
        const memberName = deposit.member.name;

        if (groupedElements[memberName]) {
            groupedElements[memberName].push(deposit);
        } else {
            groupedElements[memberName] = [deposit];
        }
    });

    return Object.values(groupedElements);
}

function calcularPorcentagemDoTotal(valor, total) {
    const porcentagem = (valor / total) * 100;
    const porcentagemArredondada = porcentagem.toFixed(1);
    return parseFloat(porcentagemArredondada);
}

function calcularTotalJuros(boxEntity) {
    let total = 0
    if (boxEntity.performance) {
        total = boxEntity.performance
            .map(it => (it.value.value))
            .reduce((acumulator, value) => acumulator + value, 0)
    }

    const totalJurosEmprestado = boxEntity.loans
        .filter(it => it.approved)
        .map(it => {
            const valueRequested = it.valueRequested.value
            const totalValue = it.totalValue.value
            return totalValue - valueRequested
        })
        .reduce((acumulator, value) => acumulator + value, 0)

    return total + totalJurosEmprestado
}

async function dadosAnalise(context, req) {
    const caixinhaId = req.query.caixinhaId

    await connect()
    const boxEntity = await getByIdOrThrow(caixinhaId, 'caixinhas')
    const depositos = await findOrderByDesc({ idCaixinha: new ObjectId(caixinhaId) }, 'depositos')
    const patrimonio = await find('evolucaoPatrimonial', { idCaixinha: new ObjectId(caixinhaId) })
    const evolucaoPatrimonial = [
        {
            name: 'Saldo da carteira',
            data: patrimonio.length > 0 ? patrimonio[0].portfolioBalance.data : []
        },
        {
            name: 'Saldo disponivel no mês',
            data: patrimonio.length > 0 ? patrimonio[0].availableBalance.data : []
        }
    ]
    const movimentacoes = []

    for (let index = 0; index < 5 && depositos[index] != null; index++) {
        movimentacoes.push({
            id: depositos[index]._id,
            tipo: 'DEPOSITO',
            valor: depositos[index].value.value,
            nick: depositos[index].member.name,
            status: 'completed',
            date: moment(depositos[index].date).format('DD/MM/YYYY')
        })
    }

    const totalDepositos = depositos.map(it => (it.value.value)).reduce((acumulator, value) => acumulator + value, 0)
    const totalEmprestimos = boxEntity.loans
        .filter(it => it.approved)
        .map(it => (it.valueRequested.value))
        .reduce((acumulator, value) => acumulator + value, 0)

    const totalJuros = calcularTotalJuros(boxEntity)
    const percentuais = {
        series: [],
        labels: []
    }

    const grouped = groupElementsByMemberName(depositos)
    if (grouped.length) {
        grouped.forEach(element => {
            const name = element[0].member.name
            const total = element.map(it => (it.value.value)).reduce((sum, value) => sum + value, 0)
            percentuais.series.push(calcularPorcentagemDoTotal(total, totalDepositos))
            percentuais.labels.push(name)
        })
    }

    const membros = []
    for (const iterator of boxEntity['members']) {
        const membro = await find('membros', { email: iterator.email, name: iterator.name })
        if (membro.length) {
            membros.push(membro[0])
        } else {
            membros.push(iterator)
        }
    }

    const result = {
        saldoTotal: boxEntity.currentBalance.value,
        totalDepositos,
        totalJuros,
        totalEmprestimos,
        movimentacoes,
        percentuais,
        evolucaoPatrimonial,
        membros
    }

    context.res = {
        body: result
    };
}

module.exports = async (context, req) => await middleware(context, req, dadosAnalise)