const { MongoMemoryServer } = require("mongodb-memory-server")
const Func = require('./index')
const { insertDocument, makeNewClient } = require('../v2/mongo-operations')

function getContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

const collectionName = 'membros'

describe('testes da funcao get user data', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('Nao deve retornar nenhuma usuario', async () => {
        const context = getContext()
        const req = {
            query: {
                memberName: 'jean', 
                email: 'jean@jean'
            }
        }


        await Func(context, req)
        expect(context.res.body).toEqual({})
    })

    it('Deve retornar um usuario', async () => {
        const context = getContext()
        const member = {
            memberName: 'jean', 
            email: 'jean@jean'
        }

        await insertDocument(collectionName, {
            name: member.memberName,
            email: member.email,
            phoneNumber: '48998457774',
            photoUrl: 'photoUrl'
        })

        const req = {
            query: {
                memberName: 'jean', 
                email: 'jean@jean'
            }
        }

        await Func(context, req)
        expect(context.res.body._id).not.toBe(null);
        expect(context.res.body.email).toBe(member.email)
        expect(context.res.body.name).toBe(member.memberName)
        expect(context.res.body.phoneNumber).toBe('48998457774')
        expect(context.res.body.photoUrl).toBe('photoUrl')
    })

    it('deve retornar o usuario passando so o email como parametro', async () => {
        const context = getContext()
        const member = {
            memberName: 'augusto', 
            email: 'augusto@bol'
        }

        await insertDocument(collectionName, {
            name: member.memberName,
            email: member.email,
            phoneNumber: '48998457774',
            photoUrl: 'photoUrl'
        })

        await insertDocument(collectionName, {
            name: 'carlos',
            email: 'carlos@bol',
            phoneNumber: '48998457774',
            photoUrl: 'photoUrl'
        })

        const req = {
            query: {
                email: member.email
            }
        }

        await Func(context, req)
        expect(context.res.body._id).not.toBe(null);
        expect(context.res.body.email).toBe(member.email)
        expect(context.res.body.name).toBe(member.memberName)
        expect(context.res.body.phoneNumber).toBe('48998457774')
        expect(context.res.body.photoUrl).toBe('photoUrl')
    })
})