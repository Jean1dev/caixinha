import { useState } from 'react'
import logo from './assets/logo.svg'
import './App.css'

function App() {
  const [insta, setInsta] = useState('')
  const [email, setEmail] = useState('')
  const [whats, setWhats] = useState('')

  return (
    <div id="main-container">
        <form onSubmit={() => {}}>
          <img alt='logo' src={logo}></img>
          <input value={insta} onChange={(e) => setInsta(e.target.value)} placeholder="@seuInsta"></input>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"></input>
          <input value={whats} onChange={(e) => setWhats(e.target.value)} placeholder="Whats Apenas numeros"></input>
          <button type="submit">Encontrar</button>
        </form>
      </div>
  )
}

export default App
