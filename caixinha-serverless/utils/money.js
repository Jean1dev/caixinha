function toCents(value) {
    const number = Number(value)
    if (!Number.isFinite(number)) {
        throw new Error('Invalid monetary value')
    }
    return Math.sign(number) * Math.round((Math.abs(number) + Number.EPSILON) * 100)
}

function fromCents(cents) {
    if (!Number.isSafeInteger(cents)) {
        throw new Error('Invalid monetary cents')
    }
    return cents / 100
}

function valueOf(value) {
    return Number(value?.value ?? value ?? 0)
}

module.exports = { toCents, fromCents, valueOf }
