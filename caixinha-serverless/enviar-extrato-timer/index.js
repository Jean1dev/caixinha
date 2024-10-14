const { enviarExtrato } = require('../scripts/enviar-extrato-por-email')
const dispatchEvent = require('../amqp/events')

module.exports = async function (_context, _myTimer) {
    _context.log('Gerando e enviando emprestimos por email')

    dispatchEvent([
        {
            type: 'NOTIFICACAO',
            data: { message: `Gerando extrato para todos os usuarios` }
        },
    ], 'default-all')
    
    await enviarExtrato()

    _context.log('Finalizado processo')
};