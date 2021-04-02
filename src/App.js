import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import DepthChart from './Containers/DepthChart'
import DepthInsights from './Containers/DepthInsights'
import Selectors from './Containers/Selectors'
import ExchangeSelectors from './Containers/ExchangeSelectors'
import Badge from 'react-bootstrap/Badge'
import BinanceInfoJson from './Helpers/BinanceInfo.json'
import CoinbaseInfoJson from './Helpers/CoinbaseInfo.json'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      exchange: '',
      chart: false,
      info: false,
      symbols: [],
      baseAssets: [],
      quoteAssets: [],
      limits: [5, 10, 20, 50, 100, 500, 1000, 5000],
      levels: [1, 2, 3],
      options: {
        base: 'BTC',
        quote: 'USD',
        limit: 50
      },
      coinbaseOptions: {
        base: 'BTC',
        quote: 'USD',
        level: 2
      },
      error: {}
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
    console.log('limit ', limit)
    const binanceExchangeLimit = this.state.limits.includes(limit)
    console.log(binanceExchangeLimit)
    this.setState(prevState => ({
      ...this.state,
      options: {
        ...this.state.options,
        limit: binanceExchangeLimit ? limit : prevState.limit
      },
      coinbaseOptions: {
        ...this.state.coinbaseOptions,
        level: binanceExchangeLimit ? prevState.limit : limit
      }
      })
    )
  }

  getCoinbaseExchangeInfo () {
    const symbols = CoinbaseInfoJson.map(symbol => symbol.id)
    const baseAssets = CoinbaseInfoJson.map(symbol => symbol.base_currency)
    const quoteAssets = CoinbaseInfoJson.map(symbol => symbol.quote_currency)
    this.setState({
      ...this.state,
      symbols: symbols,
      baseAssets: [...new Set(baseAssets)],
      quoteAssets: [...new Set(quoteAssets)]
    })
  }

  getBinanceExchangeInfo () {
    const symbols = BinanceInfoJson.symbols.map(symbol => symbol.symbol)
    const baseAssets = BinanceInfoJson.symbols.map(symbol => symbol.baseAsset)
    const quoteAssets = BinanceInfoJson.symbols.map(symbol => symbol.quoteAsset)
    this.setState({
      ...this.state,
      symbols: symbols,
      baseAssets: [...new Set(baseAssets)],
      quoteAssets: [...new Set(quoteAssets)]
    })
  }

  toggleChart = () => {
    this.setState(
      prevState => ({ chart: !prevState.chart, info: false })
    )
  }

  toggleExchange = (exchange) => {
    this.setState({
      ...this.setState,
      exchange: exchange
    }, () => {exchange === 'Binance' ? this.getBinanceExchangeInfo() : this.getCoinbaseExchangeInfo()}
    )
  }

  toggleInfo = () => {
    this.setState(
      prevState => ({ info: !prevState.info, chart: false }),
    )
  }

  render () {
    const { 
      exchange, 
      chart, 
      info, 
      symbols, 
      baseAssets, 
      quoteAssets, 
      options, 
      limits, 
      levels, 
      error, 
      coinbaseOptions} = this.state
    console.log('render: ', exchange)
    console.log(symbols.length, baseAssets.length, quoteAssets.length)
    return (
      <div className='App'>
        <Container fluid style={{paddingLeft: '0px', paddingRight: '0px'}}>
          <header className='App-header'>
          <h1 style={{'marginRight': 'auto', 'marginLeft': 'auto'}} >Supports and Resistances on 
            <Badge variant='secondary' style={{ marginLeft: '5px', marginRight: '5px' }}>{exchange || 'Exchange'}</Badge>
            {'\n'}
          </h1>
          <Row>
            <ExchangeSelectors
              exchange={exchange}
              toggleExchange={this.toggleExchange}
            />
            {!chart && <Button className={'Menu-Button'} variant='info' onClick={this.toggleChart}> See Chart </Button>}
            <br/>
            {!info && <Button variant='info' onClick={this.toggleInfo}> See Depth Insights </Button>}
          </Row>
          {error.flag && <Badge variant='secondary' style={{ margin: '5px' }}>Error fetching from {exchange}: {error.msg}</Badge>}
          {(chart || info) && !error.flag &&
            <Selectors 
              symbols={symbols} 
              baseAssets={baseAssets} 
              quoteAssets={quoteAssets} 
              options={options}
              updateBaseAsset={this.updateBaseAsset}
              updateQuoteAsset={this.updateQuoteAsset}
              updateLimit={this.updateLimit}
              limits={limits}
              levels={levels}
              exchange={exchange}
              coinbaseOptions={coinbaseOptions}
            />
          }
          {chart && !error.flag &&
            <Row className='Book-Row'>
              <DepthChart 
              symbols={symbols} 
              baseAssets={baseAssets} 
              quoteAssets={quoteAssets} 
              options={options}
              exchange={exchange}
              coinbaseOptions={coinbaseOptions}
              />
            </Row>
          }      
          {info && !error.flag &&
            <DepthInsights
              symbols={symbols} 
              baseAssets={baseAssets} 
              quoteAssets={quoteAssets} 
              options={options}
            />
          }
          </header>
        </Container>
      </div>
    )
  }
}

export default App
