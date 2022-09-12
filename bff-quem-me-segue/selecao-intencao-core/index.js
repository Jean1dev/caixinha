const IntencaoModel = require('../add-intencao-core/model')
const mongoose = require('mongoose')
const fs = require('fs')
const MONGO_URL = ''

async function buscarDados() {
    return IntencaoModel.find({})
}

function removerRepeditos(data) {
    return data.filter((este, i) => data.indexOf(este) === i)
}

function definirEstruturaDeEntrega(arrobas, data) {
    const structData = []
    arrobas.forEach(element => {
        const finded = data.find(e => e.insta === element)
        structData.push({
            insta: element.replace('@', ''),
            email: finded.email,
            whats: finded.whats
        })
    })

    return structData
}

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const data = await buscarDados()
    console.info('quantidade de solicitações ', data.length)

    const apenasArrobars = data.map(item => item.insta)
    const structData = definirEstruturaDeEntrega(removerRepeditos(apenasArrobars), data)
    console.info('quantidade de arrobas', structData.length)
    fs.writeFileSync('data.json', JSON.stringify(structData))
    process.exit(0)
})
