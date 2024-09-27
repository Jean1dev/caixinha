const crypto = require('crypto');
const { find, replaceDocumentById, connect } = require("../v2/mongo-operations")

function getGravatarUrl(email, size = 80) {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

async function getMembros() {
    const membros = await find('membros', {})
    return membros.filter(membro => {
        if (!membro.photoUrl)
            return true

        return false
    })
}

function generateGravarUrl(membros) {
    return membros.map(membro => {
        const url = getGravatarUrl(membro.email, 200)
        membro.photoUrl = url
        return membro
    })
}

async function updateMembros(membros) {
    for (const membro of membros) {
        await replaceDocumentById(membro._id, 'membros', membro)
        console.log('updated', membro.name)
    }
}

async function run() {
    await connect()
    const membros = await getMembros()
    const membrosComUrl = generateGravarUrl(membros)
    await updateMembros(membrosComUrl)
    process.exit(0)
}

run()