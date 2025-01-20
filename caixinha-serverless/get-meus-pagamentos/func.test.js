const func = require('./index')

function getContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

describe('get meus pagamentos test', () => {
    it('deve trazer todos os pagamentos por uid', async () => {
        const context = getContext()
        const req = {
            query: {
                uid: '49aaffd0-bd52-4b7a-802c-03f456ed1adc',
            }
        }

        await func(context, req)
        expect(typeof context.res).toBe('object')
        expect(context.res.status).toBe(400)
    })
})