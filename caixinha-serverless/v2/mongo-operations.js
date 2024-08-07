const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/caixinha'
const database = 'caixinha'

let client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1
});

async function connect() {
    await client.connect()
}

async function makeNewClient(newUri) {
    client = new MongoClient(newUri, {
        serverApi: ServerApiVersion.v1
    });
}

async function getDocumentById(id, collection = 'caixinhas') {
    const collectionName = client.db(database).collection(collection)
    return collectionName.findOne({ _id: new ObjectId(id) })
}

async function getByIdOrThrow(id, collection = 'caixinhas') {
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

async function findOrderByDesc(projection, collection = 'caixinhas') {
    const collectionName = client.db(database).collection(collection)
    return collectionName.find(projection)
        .sort({ _id: -1 })
        .toArray()
}

async function find(collection, projection = {}) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.find(projection).toArray()
}

async function findWithLimit(collection, projection, limit = 5) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.find(projection).limit(limit).toArray()
}

async function deleteAll(collection) {
    return client.db(database).collection(collection).deleteMany()
}

async function deleteByProjection(projection, collection) {
    return client.db(database).collection(collection).deleteMany(projection)
}

async function upsert(collection, document, filter) {
    const collectionName = client.db(database).collection(collection)
    const options = { upsert: true }
    const result = await collectionName.updateOne(filter, { $set: document }, options);
    return result
}

module.exports = {
    connect,
    getDocumentById,
    replaceDocumentById,
    insertDocument,
    find,
    getByIdOrThrow,
    deleteAll,
    findWithLimit,
    upsert,
    findOrderByDesc,
    makeNewClient,
    deleteByProjection
}