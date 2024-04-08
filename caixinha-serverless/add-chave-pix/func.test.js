const { MongoMemoryServer } = require("mongodb-memory-server")
const { saveAndReturnCaixinhaIds } = require("../factory/factory-tests")
const { getDocumentById, makeNewClient } = require("../v2/mongo-operations")
const func = require('./index')

function getContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

describe('discord aprovar emprestimo function test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('deve adicionar uma conta bancaria corretamente', async () => {
        const caixinha = await saveAndReturnCaixinhaIds()
        const context = getContext()
        const req = {
            body: {
                "key": "fe52da16-71c9-47f6-9daa-2e89034f97b0",
                "url": "https://cdn.discordapp.com/attachments/1205196923342950421/1226894437452615690/image.png?ex=66266d7c&is=6613f87c&hm=35f45cad4c85345eb14b6b4e9aa284886d50ca84e680f084992b38853d0f0d1a&",
                "caixinhaId": caixinha.id,
            }
        }

        await func(context, req)
        const caixinhaSalva = await getDocumentById(caixinha.id)
        expect(caixinhaSalva.bankAccount).toBeDefined()
        expect(caixinhaSalva.bankAccount.keysPix[0]).toEqual(req.body.key)
        expect(caixinhaSalva.bankAccount.urlsQrCodePix[0]).toEqual(req.body.url)
    })

    it('deve sobrescrever todas as contas bancarias corretamente', async () => {
        const caixinha = await saveAndReturnCaixinhaIds()
        
        const req = {
            body: {
                "key": "fe52da16-71c9-47f6-9daa-2e89034f97b0",
                "url": "https://cdn.discordapp.com/attachments/1205196923342950421/1226894437452615690/image.png?ex=66266d7c&is=6613f87c&hm=35f45cad4c85345eb14b6b4e9aa284886d50ca84e680f084992b38853d0f0d1a&",
                "caixinhaId": caixinha.id,
                replace: false
            }
        }

        await func(getContext(), req)
        let caixinhaSalva = await getDocumentById(caixinha.id)
        expect(caixinhaSalva.bankAccount).toBeDefined()
        expect(caixinhaSalva.bankAccount.keysPix.length).toBe(1)
        
        await func(getContext(), req)
        caixinhaSalva = await getDocumentById(caixinha.id)
        expect(caixinhaSalva.bankAccount.keysPix.length).toBe(2)

        await func(getContext(), {
            body: {
                "key": "fe52da16-71c9-47f6-9daa-2e89034f97b0",
                "url": "https://cdn.discordapp.com/attachments/1205196923342950421/1226894437452615690/image.png?ex=66266d7c&is=6613f87c&hm=35f45cad4c85345eb14b6b4e9aa284886d50ca84e680f084992b38853d0f0d1a&",
                "caixinhaId": caixinha.id,
                replace: true
            }
        })

        caixinhaSalva = await getDocumentById(caixinha.id)
        expect(caixinhaSalva.bankAccount.keysPix.length).toBe(1)
    })
})