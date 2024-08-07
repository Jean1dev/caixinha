const { resolveCircularStructureBSON } = require("../utils");
const { getDocumentById, insertDocument, replaceDocumentById, connect } = require("../v2/mongo-operations")
const { Box } = require("caixinha-core/dist/src");

const idCaixinha = 'x'

async function backup() {
    const caixinha = await getDocumentById(idCaixinha)
    await insertDocument('caixinha-backup', {
        date: new Date(),
        data: caixinha
    })
}

async function recalcular() {
    const caixinha = await getDocumentById(idCaixinha)
    const caixinhaObject = Box.fromJson(caixinha)
    caixinhaObject.recalculateBalance()
    const replacedDocument = resolveCircularStructureBSON(caixinhaObject)
    await replaceDocumentById(idCaixinha, 'caixinhas', replacedDocument)
}

async function run() {
    await connect()
    await backup()
    await recalcular()
    process.exit(0)
}
