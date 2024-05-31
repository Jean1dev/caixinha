function resolveCircularStructureBSON(box) {
    box['loans'] = box['loans'].map(l => ({
        ...l,
        box: undefined
    }))

    return box
}

function getDataMenosXDias(x) {
    var dataAtual = new Date();
    var novaData = new Date(dataAtual.getTime() - x * 24 * 60 * 60 * 1000);

    return novaData;
}

module.exports = {
    resolveCircularStructureBSON,
    getDataMenosXDias
}