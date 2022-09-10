const Mongoose= require('mongoose')

const IntencaoSolicitacaoModel = new Mongoose.Schema({
    insta: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    whats: {
        type: String,
        required: false
    },
}, {
    timestamps: true,
    collection: 'modelo_solicitacao_intencao'
})

module.exports = Mongoose.model('IntencaoSolicitacaoModel', IntencaoSolicitacaoModel)