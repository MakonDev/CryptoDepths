import React, { Component } from 'react'
import axios from 'axios'

class DepthInsights extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bids: [],
      asks: []
    }
  }

  componentDidMount () {
    const base = this.props.options.base
    const quote = this.props.options.quote
    const limit = this.props.options.limit
    const url = 'https://api.binance.us/api/v3/depth?symbol=' + base + quote + '&limit=' + limit
    axios.get(url)
      .then(response => {
        if (response.status === 200) {
          // this.setState({
          //   ...this.state,
          //   bids:
          console.log(response.data)
        }
      })
      .catch(err => console.log(err))
  }

  render () {
    return (
      <p>test</p>
    )
  }
}
export default DepthInsights
