import { useState } from 'react'
import logo from './assets/logo.svg'
import './App.css'

function App() {
  const [insta, setInsta] = useState('')
  const [email, setEmail] = useState('')
  const [whats, setWhats] = useState('')
  const [checked, setChecked] = useState(false)

  const handleSubmit = () => {

  }

  return (
    <div id="main-container">
      <form onSubmit={handleSubmit}>
        <img alt='logo' src={logo}></img>
        <h3> Descubra os segredos do seu insta</h3>
        <input value={insta} onChange={(e) => setInsta(e.target.value)} placeholder="@seuInsta"></input>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"></input>
        <input value={whats} onChange={(e) => setWhats(e.target.value)} placeholder="Whats Apenas numeros"></input>

        <div id='termos-uso'>
          <input type={'checkbox'} checked={checked} onChange={() => setChecked(!checked)}></input>
          <a href='https://termo-de-uso-quem-me-segue.netlify.app/' target={'_blank'}>Li e Aceito os termos de uso</a>
        </div>
        

        <button disabled={!checked} type="submit">{checked ? 'Buscar seguidores' : 'Aceite os termos para continuar'}</button>
      </form>
    </div>
  )
}

export default App
