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
        return
    }

    amqp.connect(process.env.AMQP, (error, connection) => {
        if (error) {
            return handleAMQPError(error)
        }

        connection.createChannel((channelError, channel) => {
            if (channelError) {
                return handleAMQPError(channelError)
            }

            if (Array.isArray(message)) {
                for (const key of message) {
                    channel.sendToQueue(DEFAULT_QUEUE, Buffer.from(JSON.stringify(key)))
                    console.log(" [x] Sent %s", message);
                }

                return
            }

            channel.sendToQueue(DEFAULT_QUEUE, Buffer.from(JSON.stringify(message)))
            console.log(" [x] Sent %s", message);
        })
    })
}