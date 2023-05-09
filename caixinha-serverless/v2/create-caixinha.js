const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/caixinha'
const splited = uri.split('/')
const database = splited[splited.length - 1]

const client = new MongoClient(uri);

async function create() {
    await client.connect()
    const collectionName = client.db(database).collection('caixinhas')
    const r = await collectionName.insertOne({
        deposits: [],
        loans: [],
        currentBalance: {
            value: 85
        },
        members: []
    })
    console.log(r.insertedId)
    process.exit(0)
}

create()