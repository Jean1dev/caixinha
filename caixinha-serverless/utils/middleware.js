const { asyncAPM } = require("./apm")

async function middleware(context, req, nextFunction) {
    try {
        await nextFunction(context, req)
    } catch (error) {
        context.log(error.message)

        if (!error.language) {
            asyncAPM(error)
        }

        context.res = {
            status: 400,
            body: {
                message: error.message
            }
        }
    }
}

module.exports = middleware