const middleware = require('./middleware')

describe('middleware error contract', () => {
    it('returns a stable domain error code and logs diagnostic context', async () => {
        const context = { log: jest.fn() }
        const error = new Error('Unable to calculate credit risk for overdue loan')
        error.code = 'RENEGOTIATION_RISK_CALCULATION_FAILED'

        await middleware(context, {}, async () => {
            throw error
        })

        expect(context.res).toEqual({
            status: 400,
            body: {
                message: error.message,
                code: error.code
            }
        })
        expect(context.log).toHaveBeenCalledWith(expect.objectContaining({
            event: 'request_failed',
            errorCode: error.code,
            errorMessage: error.message,
            stack: expect.any(String)
        }))
    })
})
