const moment = require('moment')
const { ObjectId } = require('mongodb')
const { connect, find } = require("../v2/mongo-operations")

function ordenarPorData(lista) {
    return lista.sort((a, b) => {
        const dataA = moment(a.date, 'DD/MM/YYYY');
        const dataB = moment(b.date, 'DD/MM/YYYY');
        return dataA - dataB;
    });
}

module.exports = async function (context, req) {
    try {
        await connect()
        let result = []

        async function findDepositosAndPutOnResult(query) {
            const depositos = await find('depositos', query)
            depositos.forEach(it => {
                result.push({
                    id: it._id,
                    tipo: 'DEPOSITO',
                    valor: it.value.value,
                    nick: it.member.name,
                    status: 'completed',
                    date: moment(it.date).format('DD/MM/YYYY')
                })
            })
        }

        async function findEmprestimosAndPutOnResult(query) {
            const emprestimos = await find('emprestimos', query)
            emprestimos.forEach(it => {
                result.push({
                    id: it._id,
                    tipo: 'EMPRESTIMO',
                    valor: it.valueRequested.value,
                    nick: it.member.name,
                    status: it.approved ? 'completed' : 'requested',
                    date: moment(it.date).format('DD/MM/YYYY')
                })
            })
        }

        if (req.query.meuExtrato) {
            if (req.query.depositos) {
                await findDepositosAndPutOnResult({ memberName: req.query.memberName })
            }

            if (req.query.emprestimos) {
                await findEmprestimosAndPutOnResult({ memberName: req.query.memberName })
            }

        } else {
            const { caixinhaId } = req.query
            if (req.query.depositos) {
                await findDepositosAndPutOnResult({ idCaixinha: new ObjectId(caixinhaId) })
            }

            if (req.query.emprestimos) {
                await findEmprestimosAndPutOnResult({ idCaixinha: new ObjectId(caixinhaId) })
            }

        }

        context.res = {
            body: ordenarPorData(result)
        }

    } catch (error) {
        context.log(error.message)
        context.res = {
            status: 400,
            body: {
                message: error.message
            }
        }
    }
}