function resolveCircularStructureBSON(box) {
    box['loans'] = box['loans'].map(l => ({
        ...l,
        box: undefined
    }))

    return box
}

module.exports = {
    resolveCircularStructureBSON
}