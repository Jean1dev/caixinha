import React, { Component } from 'react'
import './styles.css'
import logo from '../../assets/logo.svg'
import { MdInsertDriveFile } from 'react-icons/md'
import api from '../../services/api'
import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'
import DropZone from 'react-dropzone'
import socket from 'socket.io-client'

export default class Box extends Component {

  state = {
    box: {}
  }

  async componentDidMount() {
    this.subscribeToNewFiles()
    const box = this.props.match.params.id
    const response = await api.get(`boxes/${box}`)
    console.log(response.data)
    this.setState({ box: response.data })
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id
    const io = socket('http://localhost:8080')
    io.emit('connectRom', box)
    io.on('file', data => {
      this.setState({ box: { ...this.state.box, files: [data, ...this.state.box.files]}})
    })
  }

  handleUpload = files => {
    files.forEach(element => {
      const data = new FormData()
      data.append(`file`, element)
      const box = this.props.match.params.id
      api.post(`boxes/${box}/files`, data)
    });
  }

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt=""></img>
          <h1>{this.state.box.title}</h1>
        </header>
        <ul>

          <DropZone onDropAccepted={this.handleUpload}>
            {({getRootProps, getInputProps}) => (
              <div className="upload" {...getRootProps()}>
                <input {...getInputProps()}></input>
                <p>Arras arquivos ou clique aqui</p>
              </div>
            )}
          </DropZone>

          {this.state.box.files && this.state.box.files.map(file => (
            <li key={file._id}>
              <a className="fileInfo" href="">
                <MdInsertDriveFile size={24} color="#A%Cfff"></MdInsertDriveFile>
                <strong>{file.title}</strong>
              </a>
              <span>ha {distanceInWords(file.createdAt, new Date(), { locale: pt})}</span>
              </li>
          ))}

        </ul>
      </div>
    )
  }
}
