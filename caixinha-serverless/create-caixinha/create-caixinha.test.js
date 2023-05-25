require('../jest.mocks')
const func = require('./index')

describe('Create caixinha teste', () => {
    it('deve invocar a função e salvar corretamente', async () => {
        const req = {
            body: {
                name: 'teste'
            }
        }

        const context = {}
        await func(context, req)

        expect(context.res).toHaveProperty('body')
        expect(context.res.body.insertedId).not.toBeNull()
        expect(context.res.body.acknowledged).not.toBeNull()
    })
})