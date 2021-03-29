import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

class Selectors extends Component {
  render () {
    const { baseAssets, quoteAssets, limits, options, updateQuoteAsset, updateBaseAsset, updateLimit } = this.props
    return (
      <div className='Chart-Row'>
        <Row className='Book-Row'>
          <Dropdown className='Chart-Options'>
            <Dropdown.Toggle variant='success' id='dropdown-basic'>
              Select Base Asset
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {baseAssets.map((base) =>
                <Dropdown.Item key={base} onClick={() => updateBaseAsset(base)}> {base} </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className='Chart-Options'>
            <Dropdown.Toggle variant='success' id='dropdown-basic'>
              Select Quote Asset
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {quoteAssets.map((quote) =>
                <Dropdown.Item key={quote} onClick={() => updateQuoteAsset(quote)}> {quote} </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className='Chart-Options'>
            <Dropdown.Toggle variant='success' id='dropdown-basic'>
              Select Depth Limit
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {limits.map((limit) =>
                <Dropdown.Item key={limit} onClick={() => updateLimit(limit)}> {limit} </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Row>
        <Row className='Book-Row'>
          <h3>
            Base Asset
            <Badge variant='secondary' style={{ marginLeft: '5px', marginRight: '5px' }}>{options.base}</Badge>
          </h3>
          <h3>
            Quote Asset
            <Badge variant='secondary' style={{ marginLeft: '5px', marginRight: '5px' }}>{options.quote}</Badge>
          </h3>
          <h3>
            Depth Limit
            <Badge variant='secondary' style={{ marginLeft: '5px', marginRight: '5px' }}>{options.limit}</Badge>
          </h3>
        </Row>
      </div>
    )
  }
}
export default Selectors
