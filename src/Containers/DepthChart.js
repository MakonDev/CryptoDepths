import React, { Component } from 'react'
import axios from 'axios'

const baseUrl = 'https://api.binance.us/api/v3/'
const endpoint = 'depth'
const symbol = 'BTCUSD'
const url = baseUrl + endpoint + '?symbol=' + symbol + '&limit=10'
axios.get(url)
  .then(data => console.log(data))
  .catch(err => console.log(err))

class DepthChart extends Component() {
  render () {
    return (
      <p>Test</p>
    )
  }
}

export default DepthChart
