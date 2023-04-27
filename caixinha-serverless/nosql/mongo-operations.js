const mongoose = require('mongoose')
const SolicitacaoEmprestimoSchema = require('../schemas/SolicitacaoEmprestimoSchema')
const CaixinhaSchema = require('../schemas/CaixinhaSchema')

exports.connect = function () {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('conectado com o bd')
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}

exports.createNewEmprestimo = function ({ valor, juros, parcela, motivo, memberName }) {
    return new SolicitacaoEmprestimoSchema({ valor, juros, parcela, motivo, memberName })
        .save()
}

exports.getDiscordNoZapBox = function () {
    return CaixinhaSchema.findById(new mongoose.Types.ObjectId('644ab7f5f10d4800c629a1d2'))
}