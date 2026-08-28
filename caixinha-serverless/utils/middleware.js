const { asyncAPM } = require("./apm")

async function middleware(context, req, nextFunction) {
    try {
        await nextFunction(context, req)
    } catch (error) {
        context.log({
            event: 'request_failed',
            errorCode: error.code || 'UNEXPECTED_ERROR',
            errorName: error.name,
            errorMessage: error.message,
            stack: error.stack
        })

        if (!error.language) {
            asyncAPM(error)
        }

        context.res = {
            status: 400,
            body: {
                message: error.message,
                ...(error.code ? { code: error.code } : {})
            }
        }
    }
}

module.exports = middleware
