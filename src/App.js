import logo from './logo.svg'
import './App.css'
// import Binance from 'binance-api-node'

// const client = Binance()

// const client2 = Binance({
//   apiKey: process.env.REACT_APP_apiKey,
//   apiSecret: process.env.REACT_APP_apiSecret
// })

function App () {
  // client.ws.partialDepth({ symbol: 'ETHBTC', level: 10 }, depth => {
  //   console.log(depth)
  // })
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
