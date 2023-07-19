const moment = require('moment')

function mockFutureDate(days) {
    return moment().add(days, 'days')
}

let mockfunctionCalled = 0

jest.mock('../amqp/events', () => {
    return function dispatchEvent(any) {
        mockfunctionCalled++
    }
})

const mockToday = moment()

jest.mock('../v2/mongo-operations.js', () => {
    return {
        connect: function () {
            console.log('connect mock')
        },
        find: function (a, b) {
            return [{
                "member": {
                    "email": "mock"
                },
                "installments": 2,
                "billingDates": [
                    mockFutureDate(5),
                    mockFutureDate(3)
                ]
            },
            {
                "member": {
                    "email": "mock"
                },
                "installments": 0,
                "billingDates": [
                    mockToday
                ]
            },
            {
                "member": {
                    "email": "mock"
                },
                "installments": 0,
                "billingDates": [
                    mockFutureDate(2)
                ]
            }]
        }
    }
})

const azureFnc = require('./index')

describe('testes da funcao', () => {
    it('deve notificar nos momentos certos', async () => {
        await azureFnc({
            log: jest.fn()
        }, null)

        expect(mockfunctionCalled).toBe(2)
    })
})
