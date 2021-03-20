import logo from './logo.svg'
import './App.css'
import axios from 'axios'

function App () {
  const baseUrl = 'https://api.binance.us/api/v3/'
  const endpoint = 'depth'
  const symbol = 'BTCUSD'
  const url = baseUrl + endpoint + '?symbol=' + symbol + '&limit=10'
  axios.get(url)
    .then(data => console.log(data))
    .catch(err => console.log(err))

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
