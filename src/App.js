import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import axios from 'axios'
import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import DepthChart from './Containers/DepthChart'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      chart: false,
      info: false,
      symbols: [],
      baseAssets: [],
      quoteAssets: [],
      limits: [5, 10, 20, 50, 100, 500, 1000, 5000],
      options: {
        base: 'BTC',
        quote: 'USD',
        limit: 50
      }
    }
  }

  updateBaseAsset = (base) => {
    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        base: base
      }
    })
  }

  updateQuoteAsset = (quote) => {
    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        quote: quote
      }
    })
  }

  updateLimit = (limit) => {
    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        limit: limit
      }
    })
  }

  componentDidMount () {
    const url = 'https://api.binance.us/api/v3/exchangeInfo'
    axios.get(url)
      .then(response => {
        if (response.status === 200) {
          const symbolArray = response.data
          const symbols = symbolArray.symbols.map(symbol => symbol.symbol)
          const baseAssets = symbolArray.symbols.map(symbol => symbol.baseAsset)
          const quoteAssets = symbolArray.symbols.map(symbol => symbol.quoteAsset)
          this.setState({
            ...this.state,
            symbols: symbols,
            baseAssets: [...new Set(baseAssets)],
            quoteAssets: [...new Set(quoteAssets)]
          })
        }
        else {
          console.log(response)
        }
      })
      .catch(err => console.log(err))
  }

  toggleChart = () => {
    this.setState(
      prevState => ({ chart: !prevState.chart, info: false })
    )
  }

  toggleInfo = () => {
    this.setState(
      prevState => ({ info: !prevState.info, chart: false }),
    )
  }

  render () {
    const { chart, info, symbols, baseAssets, quoteAssets, options, limits} = this.state
    return (
      <div className='App'>
        <Container fluid style={{paddingLeft: '0px', paddingRight: '0px'}}>
          <header className='App-header'>
          <h1>Supports and Resistances {'\n'}</h1>
            <Row>
              {!chart && <Button className={'Menu-Button'} variant='info' onClick={this.toggleChart}> See Chart </Button>}
              <br/>
              {!info && <Button variant='info' onClick={this.toggleInfo}> See Depth Insights </Button>}
            </Row>
            {chart && 
              <Row className='Book-Row'>
                <DepthChart 
                  symbols={symbols} 
                  baseAssets={baseAssets} 
                  quoteAssets={quoteAssets} 
                  options={options}
                  updateBaseAsset={this.updateBaseAsset}
                  updateQuoteAsset={this.updateQuoteAsset}
                  updateLimit={this.updateLimit}
                  limits={limits}
                />
              </Row>
            }      
            {info &&
              <p>test</p>}
          </header>
        </Container>
      </div>
    )
  }
}

export default App
