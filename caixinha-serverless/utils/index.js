const { fromCents } = require('./money')

function resolveCircularStructureBSON(box) {
    box['loans'] = box['loans'].map(l => ({
        ...l,
        box: undefined
    }))

    return box
}

function preserveLedgerBalances(serializedBox, boxEntity) {
    if (boxEntity?._id) {
        serializedBox._id = boxEntity._id
    }
    if (serializedBox._version == null && boxEntity?._version != null) {
        serializedBox._version = boxEntity._version
    }
    if (serializedBox.balances?.ledgerActive) {
        return serializedBox
    }
    if (boxEntity?.balances) {
        serializedBox.balances = boxEntity.balances
        if (boxEntity.balances.ledgerActive) {
            serializedBox.currentBalance = {
                value: fromCents(boxEntity.balances.availableBalanceCents)
            }
        }
    }
    return serializedBox
}

function getDataMenosXDias(x) {
    var dataAtual = new Date();
    var novaData = new Date(dataAtual.getTime() - x * 24 * 60 * 60 * 1000);

    return novaData;
}

module.exports = {
    resolveCircularStructureBSON,
    preserveLedgerBalances,
    getDataMenosXDias
}