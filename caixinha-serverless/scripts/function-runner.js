const Function = require('../notificacao-vencimento-emprestimo-timer/index')

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
            emprestimoUid: 'e3adda67-0775-4df0-9f43-774088c331af',
            caixinhaId: '646f538de5cd54cc6344ec69',
            name: 'Jean',
            email: 'jean'
        }
    }
    await Function(context, params)
    process.exit(0)
}

run()