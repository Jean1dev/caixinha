const Mongoose = require('mongoose')

const CaixinhaSchema = new Mongoose.Schema({
    currentBalance: {
        type: Number,
        required: true
    },
    loans: {
        type: Array,
        required: false
    },
    deposits: {
        type: Array,
    },
    members: {
        type: Array,
        required: false
    },
}, {
    timestamps: true,
    collection: 'caixinhas'
})

module.exports = Mongoose.model('CaixinhaSchema', CaixinhaSchema)