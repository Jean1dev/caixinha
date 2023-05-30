const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/caixinha'
const database = 'caixinha'

const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1
});

async function connect() {
    await client.connect()
}

async function getDocumentById(id, collection) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.findOne({ _id: new ObjectId(id) })
}

async function getByIdOrThrow(id, collection) {
    const collectionName = client.db(database).collection(collection)
    const entity = await collectionName.findOne({ _id: new ObjectId(id) })
    if (!entity) {
        throw new Error(`Enitity in ${collection} not found`)
    }

    return entity
}

async function replaceDocumentById(id, collection, replaceDocument) {
    const collectionName = client.db(database).collection(collection)
    await collectionName.replaceOne({ _id: new ObjectId(id) }, replaceDocument)
}

async function insertDocument(collection, document) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.insertOne(document)
}

async function find(collection, projection) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.find(projection).toArray()
}

async function deleteAll(collection) {
    return client.db(database).collection(collection).deleteMany()
}

module.exports = {
    connect,
    getDocumentById,
    replaceDocumentById,
    insertDocument,
    find,
    getByIdOrThrow,
    deleteAll
}