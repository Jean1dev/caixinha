const amqp = require('amqplib/callback_api');
const { apm } = require('../utils/apm');
const DEFAULT_QUEUE = 'caixinha-serverless'

function handleAMQPError(error) {
    apm(error)
    return
}

function authorizedSubscribers(subscriberID) {
    return [
        '646f538de5cd54cc6344ec69',
        'default-all'
    ].includes(subscriberID)
}

module.exports = function dispatchEvent(message, subscriberID) {
    if (!subscriberID || !authorizedSubscribers(subscriberID)) {
        console.log('subscriber not authorized')
        return Promise.resolve(false)
    }

    return new Promise(resolve => {
        amqp.connect(process.env.AMQP, (error, connection) => {
            if (error) {
                handleAMQPError(error)
                resolve(false)
                return
            }

            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    handleAMQPError(channelError)
                    connection.close(() => resolve(false))
                    return
                }

                const messages = Array.isArray(message) ? message : [message]
                for (const item of messages) {
                    channel.sendToQueue(DEFAULT_QUEUE, Buffer.from(JSON.stringify(item)))
                    console.log(" [x] Sent %s", item)
                }

                channel.close(() => connection.close(() => resolve(true)))
            })
        })
    })
}
