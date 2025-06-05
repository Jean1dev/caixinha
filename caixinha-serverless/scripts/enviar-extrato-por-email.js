const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const path = require('path')
const PDFDocument = require('pdfkit')
const { find, connect } = require('../v2/mongo-operations')
const { Box } = require("caixinha-core/dist/src");
const { GenerateBankStatement } = require("caixinha-core/dist/src/operations")
const os = require('os')

async function enviarEmail(linkAnexos) {
    for (link of linkAnexos) {
        const email = {
            to: link.member.email,
            subject: 'Extrato',
            message: 'Segue em anexo o extrato de sua caixinha',
            attachmentLink: link.link
        }

        await axios.post('https://communication-service-4f4f57e0a956.herokuapp.com/email', email)
        console.log('Email enviado', link.member.email)
    }
}

async function uploadRelatorios(relatoriosPath) {
    const storageServiceUrl = 'https://storage-manager-svc.herokuapp.com/v1/s3'
    const BUCKET_STORAGE = 'binnoroteirizacao'
    const linkSucessos = []

    for (relatorio of relatoriosPath) {
        const fileContent = fs.createReadStream(relatorio.path)
        const form = new FormData()
        form.append('file', fileContent)

        const options = {
            method: 'POST',
            url: storageServiceUrl,
            maxBodyLength: Infinity,
            params: { bucket: BUCKET_STORAGE },
            headers: {
                'Content-Type': 'multipart/form-data',
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
            },
            data: form,
            timeout: 100000
        };

        try {
            const response = await axios.request(options)
            console.log('upload feito', response.data)

            linkSucessos.push({
                member: relatorio.member,
                link: response.data
            })
        } catch (error) {
            console.log(error)
        } finally {
            fs.unlinkSync(relatorio.path)
        }
    }

    return linkSucessos
}

function criarCabecalho(doc, extrato, today) {
    doc.fontSize(20)
        .fillColor('#2c3e50')
        .text('Extrato Financeiro', {
            align: 'center'
        })
        .moveDown()

    doc.fontSize(12)
        .fillColor('#7f8c8d')
        .text(`Data: ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`, {
            align: 'center'
        })
        .moveDown(2)

    doc.fontSize(14)
        .fillColor('#2c3e50')
        .text(`Membro: ${extrato.member.memberName}`, {
            align: 'left'
        })
        .moveDown()

    doc.fontSize(14)
        .fillColor('#2c3e50')
        .text(`Caixinha: ${extrato.boxName}`, {
            align: 'left'
        })
        .moveDown(2)
}

function formatarData(data) {
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

function adicionarDepositos(doc, depositos) {
    doc.fontSize(16)
        .fillColor('#2c3e50')
        .text('Depósitos', {
            align: 'left'
        })
        .moveDown()

    doc.fontSize(12)
    let totalDepositos = 0
    for (const deposito of depositos) {
        doc.fillColor('#34495e')
            .text(`${formatarData(deposito.date)}: R$ ${deposito.value.toFixed(2)}`, {
                align: 'left'
            })
        totalDepositos += deposito.value
    }
    doc.moveDown()
        .fillColor('#27ae60')
        .text(`Total de Depósitos: R$ ${totalDepositos.toFixed(2)}`, {
            align: 'right'
        })
        .moveDown(2)

    return totalDepositos
}

function adicionarEmprestimos(doc, emprestimos) {
    doc.fontSize(16)
        .fillColor('#2c3e50')
        .text('Empréstimos', {
            align: 'left'
        })
        .moveDown()

    doc.fontSize(12)
    let totalEmprestimos = 0
    for (const emprestimo of emprestimos) {
        doc.fillColor('#34495e')
            .text(`${formatarData(emprestimo.date)}: R$ ${emprestimo.value.toFixed(2)}`, {
                align: 'left'
            })
        totalEmprestimos += emprestimo.value
    }
    doc.moveDown()
        .fillColor('#c0392b')
        .text(`Total de Empréstimos: R$ ${totalEmprestimos.toFixed(2)}`, {
            align: 'right'
        })
        .moveDown(2)

    return totalEmprestimos
}

function adicionarSaldo(doc, totalDepositos, totalEmprestimos) {
    doc.fontSize(14)
        .fillColor('#2c3e50')
        .text(`Saldo: R$ ${(totalDepositos - totalEmprestimos).toFixed(2)}`, {
            align: 'right'
        })
}

async function gerarPDF(extrato, today) {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50
    })
    const filename = `${extrato.member.memberName}-${extrato.boxName}.pdf`
    const fullFileName = path.join(os.tmpdir(), filename)
    const writeStream = fs.createWriteStream(fullFileName)
    doc.pipe(writeStream)

    criarCabecalho(doc, extrato, today)
    const totalDepositos = adicionarDepositos(doc, extrato.deposits)
    const totalEmprestimos = adicionarEmprestimos(doc, extrato.loans)
    adicionarSaldo(doc, totalDepositos, totalEmprestimos)

    doc.end()

    await new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            console.log(`Arquivo ${filename} foi criado com sucesso.`);
            resolve();
        });
        writeStream.on('error', reject);
    });

    return {
        member: extrato.member,
        path: fullFileName
    }
}

async function gerarRelatorios(extratos) {
    const listFiles = []
    const today = new Date()
    
    for (const extrato of extratos) {
        const file = await gerarPDF(extrato, today)
        listFiles.push(file)
    }

    return listFiles
}

async function getAllCaixinhas() {
    const caixinhas = await find('caixinhas', {})
    return caixinhas.map(caixinha => Box.fromJson(caixinha))
}

async function gerarExtrato(caixinhas) {
    const extratos = []
    const membrosComExtratoRealizado = new Set()
    for (const caixinha of caixinhas) {
        for (const membro of caixinha._members) {
            if (membrosComExtratoRealizado.has(membro.memberName)) continue

            GenerateBankStatement(membro, caixinhas)
                .forEach(extratosOutput => extratos.push(extratosOutput))
            membrosComExtratoRealizado.add(membro.memberName)
        }
    }

    return extratos
}

async function run() {
    await connect()
    const caixinhas = await getAllCaixinhas()
    const extratos = await gerarExtrato(caixinhas)
    const listFiles = await gerarRelatorios(extratos)
    const linkAnexos = await uploadRelatorios(listFiles)
    await enviarEmail(linkAnexos)
}

module.exports = {
    enviarExtrato: run
}
