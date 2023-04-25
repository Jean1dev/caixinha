const mongoose = require('mongoose')
const ModelData = require('./model')

module.exports = ({ valor, juros, parcela, motivo, memberName }) => {
    return mongoose.connect(process.env.MONGO_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        return new ModelData({ valor, juros, parcela, motivo, memberName }).save()
    })
}