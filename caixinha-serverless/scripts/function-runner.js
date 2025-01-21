const Function = require('../notificacao-vencimento-emprestimo-timer')

function createContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

async function run() {
    const context = createContext()
    const params = {}
    await Function(context, params)  
    process.exit(0) 
}

run()