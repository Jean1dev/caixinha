const { MongoClient } = require('mongodb');

async function prd_connectToMongoDB(uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB Producao');
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function localhost_connectToMongoDB() {
    const client = new MongoClient('mongodb://localhost:27017/caixinha', { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB Localhost');
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function listCollectionsAndQueryDocuments(client, dbName) {
    try {
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        const results = [];

        for (const collection of collections) {
            const collectionName = collection.name;
            console.log('query ', collectionName)
            const documents = await db.collection(collectionName).find({}).toArray();
            results.push({ collectionName, documents });
        }

        console.log('Collections and their documents:', results.length);
        return results;
    } catch (error) {
        console.error('Error listing collections and querying documents:', error);
        throw error;
    }
}

async function insertManyDocuments(client, dbName, collectionName, documents) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertMany(documents);
        console.log('Inserted documents:', result.insertedCount);
        return result;
    } catch (error) {
        console.error('Error inserting documents:', error);
        throw error;
    }
}

async function run() {
    const prd_client = await prd_connectToMongoDB('URL_PRD')
    const local_client = await localhost_connectToMongoDB()

    const documents = await listCollectionsAndQueryDocuments(prd_client, 'caixinha')
    for (const item of documents) {
        console.log('insert', item.collectionName)
        await insertManyDocuments(local_client, 'caixinha', item.collectionName, item.documents)
    }

    process.exit(0)
}

run()