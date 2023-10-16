const Func = require('./index')

describe('gerar link de pagamento testes', () => {
    it('deve retornar erro pq um dos parametros nao foi passado corretamente', async () => {
        const context = { log: jest.fn() }
        await Func(context, {
            body: {
                name: 'name',
                valor: 34.2,
                pix: '05'
            }
        })

        expect(context.res.status).toBe(400)
        expect(context.res.body.message).toBe('Parametros obrigatorios nao fornecidos corretamente { name, email, valor, pix }')

        await Func(context, {
            body: {
                email: 'name',
                valor: 34.2,
                pix: '05'
            }
        })

        expect(context.res.body.message).toBe('Parametros obrigatorios nao fornecidos corretamente { name, email, valor, pix }')

        await Func(context, {
            body: {
                email: 'name',
                name: '34.2',
                pix: '05'
            }
        })

        expect(context.res.body.message).toBe('Parametros obrigatorios nao fornecidos corretamente { name, email, valor, pix }')

        await Func(context, {
            body: {
                email: 'name',
                valor: 34.2,
                name: '05'
            }
        })

        expect(context.res.body.message).toBe('Parametros obrigatorios nao fornecidos corretamente { name, email, valor, pix }')
    })

    it('deve executar com sucesso', async () => {

        const context = { log: jest.fn() }
        await Func(context, {
            body: {
                email: 'name',
                valor: 34.2,
                name: '05',
                pix: 'px'
            }
        })

        expect(context.res).toBe(undefined)
    })
})