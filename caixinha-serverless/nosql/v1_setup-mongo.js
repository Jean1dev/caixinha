const mongoose = require('mongoose')
const CaixinhaSchema = require('../schemas/CaixinhaSchema')

const MONGO_URL = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/caixinha'
console.log(MONGO_URL)

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const caixinha = new CaixinhaSchema({
        deposits: [],
        loans: [],
        currentBalance: 85,
        members: []
    })

    await caixinha.save()
    console.log(caixinha._id)
    process.exit(0)
})
