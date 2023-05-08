const Mongoose = require('mongoose')

const SolicitacaoEmprestimo = new Mongoose.Schema({
    approved: Boolean,
    member: { name: String, email: String },
    date: Date,
    valueRequested: { value: Number },
    fees: { value: Number },
    interest: { value: Number },
    box: { _id: String, currentBalance: { value: Number } },
    approvals: Number,
    description: String,
    payments: [],
    memberName: String,
    requiredNumberOfApprovals: Number,
    billingDates: [String]
}, {
    timestamps: true,
    collection: 'solicitacao_emprestimo',

})

const schema =  Mongoose.model('SolicitacaoEmprestimo', SolicitacaoEmprestimo)

module.exports = schema