import { useState } from 'react'
import './modal.css'

function Modal({ show, failure }: any) {
    const [_show, setShow] = useState(show)

    const onClose = () => {
        setShow(false)
    }

    if (failure) {
        return (
            <div className="modal" id="modal">
                <h2>Estamos com problemas internos por aqui</h2>
                <div className="content">
                    <span>
                        Vamos resolver em breve
                    </span>
                    <br />
                    <br />
                </div>
            </div>
        )
    }


    if (!_show) {
        return <></>
    }

    return (
        <div className="modal" id="modal">
            <h2>Pedido enviado</h2>
            <div className="content">
                <span>
                    No momento pode levar até 24 horas para processar seu pedido dependendo da quantidade de solicitações abertas.
                </span>
                <br />
                <span>
                    Você vai receber por email ou whatsapp
                </span>
                <br />
            </div>
            <div className="actions">
                <button className="toggle-button" onClick={onClose}>
                    Ok
                </button>
            </div>
        </div>
    )
}

export default Modal