const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/caixinha'
const splited = uri.split('/')
const database = splited[splited.length - 1]

const client = new MongoClient(uri);

async function connect() {
    await client.connect()
}

async function getDocumentById(id, collection) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.findOne({ _id: new ObjectId(id) })
}

async function replaceDocumentById(id, collection, replaceDocument) {
    const collectionName = client.db(database).collection(collection)
    await collectionName.replaceOne({ _id: new ObjectId(id) }, replaceDocument)
}

async function insertDocument(collection, document) {
    const collectionName = client.db(database).collection(collection)
    await collectionName.insertOne(document)
}

async function find(collection, projection) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.find(projection).toArray()
}

module.exports = {
    connect,
    getDocumentById,
    replaceDocumentById,
    insertDocument,
    find
}