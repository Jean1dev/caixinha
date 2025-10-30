const Function = require('../solicitar-renegociacao/index')

function createContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

async function run() {
    const context = createContext()
    const params = {
        body: {
            emprestimoUid: 'a802224e-d918-4a04-950e-12c894d59074',
            caixinhaId: '646f538de5cd54cc6344ec69',
        }
    }
    await Function(context, params)
    process.exit(0)
}

run()