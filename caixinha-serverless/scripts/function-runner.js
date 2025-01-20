const Function = require('../get-meus-pagamentos')

function createContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

async function run() {
    const context = createContext()

    const params2 = {
        query: {
            all: true,
            email: 'jeanlucafp@gmail.com',
            user: 'Jeanluca FP'
        }
    }
    await Function(context, params2)  
    process.exit(0) 
}

run()