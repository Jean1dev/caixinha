const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/caixinha'
const database = 'caixinha'

let client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1
});
let transactionsSupported = true

async function connect() {
    await client.connect()
}

async function makeNewClient(newUri) {
    client = new MongoClient(newUri, {
        serverApi: ServerApiVersion.v1
    });
    transactionsSupported = false
}

async function getDocumentById(id, collection = 'caixinhas', options = {}) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.findOne({ _id: new ObjectId(id) }, { session: options.session })
}

async function getByIdOrThrow(id, collection = 'caixinhas', options = {}) {
    const collectionName = client.db(database).collection(collection)
    const entity = await collectionName.findOne({ _id: new ObjectId(id) }, { session: options.session })
    if (!entity) {
        throw new Error(`Enitity in ${collection} not found`)
    }

    return entity
}

async function replaceDocumentById(id, collection, replaceDocument, options = {}) {
    const collectionName = client.db(database).collection(collection)
    const filter = { _id: new ObjectId(id) }
    if (Object.prototype.hasOwnProperty.call(options, 'expectedVersion')) {
        filter._version = options.expectedVersion == null ? { $exists: false } : options.expectedVersion
        replaceDocument._version = (options.expectedVersion || 0) + 1
    }
    const result = await collectionName.replaceOne(filter, replaceDocument, { session: options.session })
    if (Object.prototype.hasOwnProperty.call(options, 'expectedVersion') && result.matchedCount !== 1) {
        const error = new Error('A caixinha foi alterada por outra operacao; tente novamente')
        error.code = 'BOX_CONCURRENT_UPDATE'
        error.status = 409
        throw error
    }
    return result
}

async function insertDocument(collection, document, options = {}) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.insertOne(document, { session: options.session })
}

async function findOrderByDesc(projection, collection = 'caixinhas') {
    const collectionName = client.db(database).collection(collection)
    return collectionName.find(projection)
        .sort({ _id: -1 })
        .toArray()
}

async function find(collection, projection = {}, options = {}) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.find(projection, { session: options.session }).toArray()
}

async function withTransaction(work) {
    if (!transactionsSupported) return work(undefined)
    const session = client.startSession()
    try {
        let result
        await session.withTransaction(async () => {
            result = await work(session)
        })
        return result
    } finally {
        await session.endSession()
    }
}

async function findWithLimit(collection, projection, limit = 5) {
    const collectionName = client.db(database).collection(collection)
    return collectionName.find(projection).limit(limit).toArray()
}

async function deleteAll(collection) {
    return client.db(database).collection(collection).deleteMany()
}

async function deleteByProjection(projection, collection, options = {}) {
    return client.db(database).collection(collection).deleteMany(projection, { session: options.session })
}

async function upsert(collection, document, filter, operationOptions = {}) {
    const collectionName = client.db(database).collection(collection)
    const options = { ...operationOptions, upsert: true, session: operationOptions.session }
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
    deleteByProjection,
    withTransaction
}
