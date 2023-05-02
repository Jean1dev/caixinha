const Mongoose= require('mongoose')

const SolicitacaoEmprestimo = new Mongoose.Schema({
    valor: {
        type: String,
        required: true
    },
    juros: {
        type: String,
        required: true
    },
    parcela: {
        type: String,
        required: true
    },
    motivo: {
        type: String,
        required: true
    },
    memberName: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    collection: 'solicitacao_emprestimo'
})

module.exports = Mongoose.model('SolicitacaoEmprestimo', SolicitacaoEmprestimo)