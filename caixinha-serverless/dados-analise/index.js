const middleware = require('../utils/middleware')
const { ObjectId } = require('mongodb')
const moment = require('moment')
const { connect, getByIdOrThrow, find } = require("../v2/mongo-operations");

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

async function dadosAnalise(context, req) {
    const caixinhaId = req.query.caixinhaId

    await connect()
    const boxEntity = await getByIdOrThrow(caixinhaId, 'caixinhas')
    const depositos = await find('depositos', { idCaixinha: new ObjectId(caixinhaId) })
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