const mockSendToQueue = jest.fn()
const mockChannelClose = jest.fn(callback => callback())
const mockConnectionClose = jest.fn(callback => callback())
const mockCreateChannel = jest.fn(callback => callback(null, {
    sendToQueue: mockSendToQueue,
    close: mockChannelClose
}))
const mockConnect = jest.fn((_uri, callback) => callback(null, {
    createChannel: mockCreateChannel,
    close: mockConnectionClose
}))
const mockApm = jest.fn()

jest.mock('amqplib/callback_api', () => ({ connect: (...args) => mockConnect(...args) }))
jest.mock('../utils/apm', () => ({ apm: (...args) => mockApm(...args) }))

const dispatchEvent = require('./events')

describe('dispatchEvent', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns an awaitable result and closes AMQP resources after all messages', async () => {
        const result = await dispatchEvent([{ type: 'A' }, { type: 'B' }], 'default-all')

        expect(result).toBe(true)
        expect(mockSendToQueue).toHaveBeenCalledTimes(2)
        expect(mockChannelClose).toHaveBeenCalledTimes(1)
        expect(mockConnectionClose).toHaveBeenCalledTimes(1)
    })

    it('does not connect an unauthorized subscriber', async () => {
        await expect(dispatchEvent({ type: 'A' }, 'unknown')).resolves.toBe(false)
        expect(mockConnect).not.toHaveBeenCalled()
    })

    it('reports connection failures and resolves without hanging', async () => {
        mockConnect.mockImplementationOnce((_uri, callback) => callback(new Error('offline')))

        await expect(dispatchEvent({ type: 'A' }, 'default-all')).resolves.toBe(false)
        expect(mockApm).toHaveBeenCalledWith(expect.objectContaining({ message: 'offline' }))
    })
})
