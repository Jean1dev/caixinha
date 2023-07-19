const amqp = require('amqplib/callback_api');
const { apm } = require('../utils/apm');

function handleAMQPError(error) {
    apm(error)
    return
}

module.exports = function dispatchEvent(message) {
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
                    channel.sendToQueue('caixinha-serverless', Buffer.from(JSON.stringify(key)))
                    console.log(" [x] Sent %s", message);
                }

                return
            }

            channel.sendToQueue('caixinha-serverless', Buffer.from(JSON.stringify(message)))
            console.log(" [x] Sent %s", message);
        })
    })
}