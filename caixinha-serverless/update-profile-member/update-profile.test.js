const { MongoMemoryServer } = require("mongodb-memory-server")
const { findWithLimit, makeNewClient, insertDocument } = require('../v2/mongo-operations')
const Func = require('./index')

function getContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

const collectionName = 'membros'

describe('deve testar a funcao de update profile', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('deve criar um usuario novo completo com sucesso', async () => {
        const context = getContext()
        const body = { 
            memberName: 'jean', 
            email: 'jean@jean.com', 
            user: {
                phone: 'phone',
                accounts: {
                    keyPix: 'keyPix',
                    Qrcode: 'Qrcode'
                }
            }
        }

        await Func(context, { body })

        const data = await findWithLimit(collectionName, { name: body.memberName, email: body.email }, 1)
        expect(typeof data[0]).toBe('object')
        expect(data[0].name).toBe(body.memberName)
        expect(data[0].email).toBe(body.email)
        expect(data[0].phoneNumber).toBe(body.user.phone)
        expect(data[0].photoUrl).toBeNull()
        expect(data[0].bankAccount.keysPix[0]).toBe(body.user.accounts.keyPix)
        expect(data[0].bankAccount.urlsQrCodePix[0]).toBe(body.user.accounts.Qrcode)

    }, 30000)

    it('deve atualizar um usuario', async () => {
        const context = getContext()
        const body = { 
            memberName: 'jean', 
            email: 'jean@jean.com', 
            user: {
                photoUrl: 'outra foto',
                phone: 'phone',
                accounts: {
                    keyPix: 'keyPix',
                    Qrcode: 'Qrcode'
                }
            }
        }

        await insertDocument(collectionName, {
            name: body.memberName,
            email: body.email,
            phoneNumber: '48998457774',
            photoUrl: 'photoUrl'
        })

        await Func(context, { body })

        const data = await findWithLimit(collectionName, { name: body.memberName, email: body.email }, 1)
        expect(typeof data[0]).toBe('object')
        expect(data[0].name).toBe(body.memberName)
        expect(data[0].email).toBe(body.email)
        expect(data[0].phoneNumber).toBe(body.user.phone)
        expect(data[0].photoUrl).toBe(body.user.photoUrl)
        expect(data[0].bankAccount.keysPix[0]).toBe(body.user.accounts.keyPix)
        expect(data[0].bankAccount.urlsQrCodePix[0]).toBe(body.user.accounts.Qrcode)
    }, 30000)
})