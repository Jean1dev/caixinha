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

module.exports = async function (context, req) {
    const caixinhaId = req.query.caixinhaId

    await connect()
    const boxEntity = await getByIdOrThrow(caixinhaId, 'caixinhas')
    const depositos = await find('depositos', { idCaixinha: new ObjectId(caixinhaId) })
    const movimentacoes = []

    depositos.forEach(it => {
        movimentacoes.push({
            id: it._id,
            tipo: 'DEPOSITO',
            valor: it.value.value,
            nick: it.member.name,
            status: 'completed',
            date: moment(it.date).format('DD/MM/YYYY')
        })
    })

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

    const result = {
        saldoTotal: boxEntity.currentBalance.value,
        totalDepositos,
        movimentacoes,
        percentuais,
    }

    context.res = {
        body: result
    };
}