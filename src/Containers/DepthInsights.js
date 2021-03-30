import React, { Component } from 'react'
import axios from 'axios'
import Plot from 'react-plotly.js'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import numberWithCommas from '../Helpers/MiscFunctions'

class DepthInsights extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bids: {
        bidPrice: [],
        bidVolume: []
      },
      asks: {
        askPrice: [],
        askVolume: []
      },
      symbolPrice: 0
    }
  }

  intervalID

  componentDidUpdate (prevProps) {
    if (prevProps.options !== this.props.options) {
      console.log('changed')
      this.componentDidMount()
    }
  }

  componentDidMount () {
    this.loadData()
    this.intervalID = setInterval(this.loadData.bind(this), 30000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalID)
  }

  async loadData () {
    try {
      const base = this.props.options.base
      const quote = this.props.options.quote
      const limit = this.props.options.limit
      const url = 'https://api.binance.us/api/v3/depth?symbol=' + base + quote + '&limit=' + limit
      axios.get(url)
        .then(response => {
          if (response.status === 200) {
            const bidPrice = response.data.bids.map(bid => bid[0])
            const bidVolume = response.data.bids.map(bid => bid[1])
            const askPrice = response.data.asks.map(ask => ask[0])
            const askVolume = response.data.asks.map(ask => ask[1])
            this.setState({
              ...this.state,
              bids: {
                bidPrice: bidPrice,
                bidVolume: bidVolume
              },
              asks: {
                askPrice: askPrice,
                askVolume: askVolume
              }
            })
          }
        })
        .catch(err => console.log(err))

      const priceUrl = 'https://api.binance.us/api/v3/avgPrice?symbol='+ base + quote
      axios.get(priceUrl)
        .then(response => {
          if (response.status === 200) {
            this.setState({
              ...this.state,
              symbolPrice: response.data.price
            })
          }
        })
        .catch(err => console.log(err))
    } catch (e) {
      console.log(e)
    }
  }

  getLargestVolumes (bids, asks) {
    const bidSizes = [...bids.bidVolume].sort(function(a, b){return b-a})
    const askSizes = [...asks.askVolume].sort(function(a, b){return b-a})
    let majorBidVolumes = []
    let majorAskVolumes = []
    for (let i = 0; i < 5; i++) {
      const bidIndex = bids.bidVolume.indexOf(bidSizes[i])
      const askIndex = asks.askVolume.indexOf(askSizes[i])

      const bidPrice = bids.bidPrice[bidIndex]
      const askPrice = asks.askPrice[askIndex]

      majorBidVolumes.push([bidPrice, bidSizes[i]])
      majorAskVolumes.push([askPrice, askSizes[i]])
    }

    return [majorBidVolumes, majorAskVolumes]
  }

  render () {
    const { bids, asks, symbolPrice } = this.state
    const { options } = this.props
    const [majorBidVolumes, majorAskVolumes] = this.getLargestVolumes(bids, asks)
    return (
      <div style={{width: '100%'}}>
        <Row>
          <Col sm={9} style={{padding: '0'}}>
          <Plot
            style={{position: 'relative', display: 'inline-block', overflow: 'hidden'}}
            data={[
              {
                x: bids.bidPrice,
                y: bids.bidVolume,
                type: 'histogram',
                marker: {
                  line: {
                    width: 1
                  },
                  color: 'green'
                }
              }
            ]}
            layout={{ 
              width: 400, 
              height: 400, 
              title: 'Bids', 
              xaxis: {title: "Price"}, 
              yaxis: {title: "Volume"},
              marginRight: '10px'
            }}
          />
          <Plot
            style={{position: 'relative', display: 'inline-block', overflow: 'hidden'}}
            data={[
              {
                x: asks.askPrice,
                y: asks.askVolume,
                type: 'histogram',
                marker: {
                  line: {
                    width: 1
                  },
                  color: 'red'
                }
              }
            ]}
            layout={{ 
              width: 400, 
              height: 400, 
              title: 'Asks', 
              xaxis: {title: "Price"}, 
              yaxis: {title: "Volume"} 
            }}
          />
          </Col>
          {(majorBidVolumes && majorAskVolumes) && 
          <Col sm={3} style={{fontSize: '12px', padding: '0'}}>
            <h4>Top 5 Bid Spikes</h4>
            <ol>
              {majorBidVolumes.map((bid) => {
                return (
                <li key={bid[0]}>
                  Price: {options.quote === 'USD' ? '$' : ''}{bid[0]} 
                  - Volume: {bid[1]} 
                  - {options.quote === 'USD' ? '$' : ''}{numberWithCommas(bid[1] * symbolPrice)}</li>
                )
              })}
            </ol>
            <h3>Top 5 Ask Spikes</h3>
            <ol>
              {majorAskVolumes.map((ask) => {
                  return (
                  <li key={ask[0]}>
                    Price: {options.quote === 'USD' ? '$' : ''}{ask[0]} 
                    - Volume: {ask[1]} 
                    - {options.quote === 'USD' ? '$' : ''}{numberWithCommas(ask[1] * symbolPrice)}</li>
                  )
                })}
            </ol>
          </Col>
        }
        </Row>
        <h1>Average Price (5 min): {options.quote === 'USD' ? '$' : ''}{numberWithCommas(1*symbolPrice)}</h1>
      </div>
    )
  }
}
export default DepthInsights
