import React, { Component } from 'react'
import axios from 'axios'
import Plot from 'react-plotly.js'
import Row from 'react-bootstrap/Row'

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
      }
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
    } catch (e) {
      console.log(e)
    }
  }

  getLargestVolumes (bids, asks) {
    const sizes = [...bids.bidVolume].sort(function(a, b){return b-a})
    const prices = sizes.slice(0, 5).map((size) => { 
      const index = bids.bidVolume.indexOf(size)
      return bids.bidPrice[index]
    })

    var majorVolumes = []
    for (let i = 0; i < prices.length; i++) {
      majorVolumes.push([prices[i], sizes[i]]);
    }

    return majorVolumes
  }

  render () {
    const { bids, asks } = this.state
    const spikes = this.getLargestVolumes(bids, asks)
    console.log(spikes)
    return (
      <div>
        <Row>
          <Plot
            data={[
              {
                x: bids.bidPrice,
                y: bids.bidVolume,
                type: 'histogram'
              }
            ]}
            layout={{ width: 500, height: 400, title: 'Bids' }}
          />
          <Plot
            data={[
              {
                x: asks.askPrice,
                y: asks.askVolume,
                type: 'histogram'
              }
            ]}
            layout={{ width: 500, height: 400, title: 'Asks',  }}
          />
        </Row>
        {spikes && <Row>
          {spikes.map((spike) => {
            return (
              <div>
            <p key={spike[0]}>{spike[0]} : {spike[1]}{this.props.options.base}</p>
            <br/>
            </div>
            )
          })}
        </Row>
        }
      </div>
    )
  }
}
export default DepthInsights
