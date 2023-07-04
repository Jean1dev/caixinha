const Sentry = require("@sentry/node");

const useSentry = process.env.SENTRY_DNS

if (useSentry) {
    Sentry.init({
        dsn: useSentry
    });
}

async function asyncAPM(error) {
    if (useSentry) {
        Sentry.captureException(error);
        await Sentry.flush(2000);
    }
}

function apm(error) {
    if (useSentry) {
        console.log(error)
        Sentry.captureException(error);
        Sentry.flush(1000).catch(() => console.log('problemas para enviar dados ao sentry'))
    }
}

module.exports = {
    asyncAPM,
    apm
}