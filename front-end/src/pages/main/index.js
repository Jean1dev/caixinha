import React, { Component } from 'react'

import logo from '../../assets/logo.svg'
import './styles.css'
import api from '../../services/api'

export default class Main extends Component {

  state = {
    newBox: ''
  }

  handleSubmit = async e => {
    e.preventDefault()
    const response = await api.post('/boxes', {
      title: this.state.newBox
    })

    console.log(response)
    this.props.history.push(`/box/${response.data._id}`)
  }

  handleInputChange = e => {
    this.setState({ newBox: e.target.value })
  }

  render() {
    return (
      <div id="main-container">
        <form onSubmit={this.handleSubmit}>
          <img alt='logo' src={logo}></img>
          <input value={this.state.newBox} onChange={this.handleInputChange} placeholder="criar um box"></input>
          <button type="submit">Criar</button>
        </form>
      </div>
    )
  }
}
