const mongoose = require('mongoose')
const SolicitacaoEmprestimoSchema = require('../schemas/SolicitacaoEmprestimoSchema')
const CaixinhaSchema = require('../schemas/CaixinhaSchema')
const MemberSchema = require('../schemas/MemberSchema')

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

exports.createNewMember = function({ memberName, email }) {
    return new MemberSchema({ memberName, email }).save()
}

exports.getBoxById = function (id) {
    return CaixinhaSchema.findById(new mongoose.Types.ObjectId(id))
}

exports.getDiscordNoZapBox = function () {
    return CaixinhaSchema.findById(new mongoose.Types.ObjectId(process.env.CAIXINHA_ID))
}

exports.getAllCaixinhas = function() {
    return CaixinhaSchema.find({})
}