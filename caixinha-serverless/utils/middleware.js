const Sentry = require("@sentry/node");

const useSentry = process.env.SENTRY_DNS

if (useSentry) {
    Sentry.init({
        dsn: useSentry
    });
}

async function middleware(context, req, nextFunction) {
    try {
        await nextFunction(context, req)
    } catch (error) {
        context.log(error.message)

        if (useSentry) {
            Sentry.captureException(error);
            await Sentry.flush(2000);
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