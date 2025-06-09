const middleware = require('../utils/middleware')
const { Box, FullDataMember } = require('caixinha-core/dist/src')
const { GetInactiveMembers } = require('caixinha-core/dist/src/useCase')
const { connect, getDocumentById, find } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')

async function getFullDataMember(inactiveMember) {
    const membro = await find('membros', { 
        email: inactiveMember.member.email, 
        name: inactiveMember.member.name 
    })

    if (!membro || membro.length === 0) {
        return {
            memberName: inactiveMember.member.name,
            _email: inactiveMember.member.email,
            _phoneNumber: ''
        }
    }
    return FullDataMember.fromJson(membro[0])
}

function createEmailEvent(fullDataMember, lastDepositDay) {
    return {
        type: 'EMAIL',
        data: {
            message: `Olá ${fullDataMember.memberName}, seu ultimo depósito foi em ${lastDepositDay}, aproveite e faça um deposito hoje e ganhe 5 reais de bonus`,
            remetentes: [fullDataMember._email]
        }
    }
}

function createSMSEvent(fullDataMember) {
    return {
        type: 'SMS',
        data: { 
            message: `Olá ${fullDataMember.memberName}, faz tempo que voce nao fez um deposito, aproveita e faça agora com uma oferta especial`,
            phone: fullDataMember._phoneNumber
        }
    }
}

async function processInactiveMember(inactiveMember, caixinhaID) {
    const fullDataMember = await getFullDataMember(inactiveMember)
    const events = [
        createEmailEvent(fullDataMember, inactiveMember.lastDepositDay),
        createSMSEvent(fullDataMember)
    ]
    
    dispatchEvent(events, caixinhaID)
}

async function processBox(boxId) {
    const boxEntity = await getDocumentById(boxId)
    const box = Box.fromJson(boxEntity)
    const inactiveMembers = GetInactiveMembers(box)
    
    for (const inactiveMember of inactiveMembers) {
        await processInactiveMember(inactiveMember, boxId)
    }
}

async function gerarOportunidadeDeDeposito(context, req) {
    const { ids } = req.body
    await connect()

    for (const id of ids) {
        await processBox(id)
    }
}

module.exports = async (context, req) => await middleware(context, req, gerarOportunidadeDeDeposito)