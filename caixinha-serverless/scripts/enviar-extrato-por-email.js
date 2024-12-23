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

function preencherDepositos(doc, depositos) {
    doc
        .fillColor('black')
        .text('Depositos', {
            width: 410,
            align: 'center'
        })
        .moveDown()

    for (deposito of depositos) {
        doc
            .fillColor('black')
            .text(`${deposito.date}: R$${deposito.value}`)
            .moveDown()
    }
}

function preencherEmprestimos(doc, emprestimos) {
    doc
        .fillColor('black')
        .text('Emprestimos', {
            width: 410,
            align: 'center'
        })
        .moveDown()

    for (emprestimo of emprestimos) {
        doc
            .fillColor('black')
            .text(`${emprestimo.date}: R$${emprestimo.value}`)
            .moveDown()
    }
}

async function gerarRelatorios(extratos) {
    const listFiles = []
    const today = new Date()
    for (extrato of extratos) {
        const doc = new PDFDocument()
        const filename = `${extrato.member.memberName}-${extrato.boxName}.pdf`
        const fullFileName = path.join(os.tmpdir(), filename)
        const writeStream = fs.createWriteStream(fullFileName)
        doc.pipe(writeStream)
        doc.text(`Extrato ate o dia ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}.`, {
            width: 410,
            align: 'center'
        })

        preencherDepositos(doc, extrato.deposits)
        preencherEmprestimos(doc, extrato.loans)

        doc
            .addPage()
            .fillColor('blue')
            .text(extrato.boxName, 100, 100)
            .underline(100, 100, 160, 27, { color: '#0000FF' })

        doc.end()
        listFiles.push({
            member: extrato.member,
            path: fullFileName
        })

        await new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                console.log(`Arquivo ${filename} foi criado com sucesso.`);
                resolve();
            });
            writeStream.on('error', reject);
        });
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
    for (caixinha of caixinhas) {
        for (membro of caixinha._members) {
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