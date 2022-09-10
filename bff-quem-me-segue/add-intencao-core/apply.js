const mongoose = require('mongoose')
const ModelData = require('./model')

module.exports = ({ insta, email, whats }) => {
    return mongoose.connect(process.env.MONGO_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        return new ModelData({ insta, email, whats }).save()
    })
}