import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

function Selectors ({ baseAssets, quoteAssets, limits, options, updateQuoteAsset, updateBaseAsset, updateLimit, exchange, levels, coinbaseOptions }) {
  const binanceExchangeCurrent = exchange === 'Binance'
  console.log(binanceExchangeCurrent, exchange)
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
            Select Depth {binanceExchangeCurrent ? 'Binance' : 'Coinbase'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {binanceExchangeCurrent ? limits.map((limit) => {
              return (<Dropdown.Item key={limit} onClick={() => updateLimit(limit)}> {limit} </Dropdown.Item>)
            })
              : levels.map((level) => {
                return (<Dropdown.Item key={level} onClick={() => updateLimit(level)}> {level} </Dropdown.Item>)
              })}
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
          Depth {binanceExchangeCurrent ? 'Limit' : 'Level'}
          <Badge variant='secondary' style={{ marginLeft: '5px', marginRight: '5px' }}>
            {binanceExchangeCurrent ? options.limit : coinbaseOptions.level}
          </Badge>
        </h3>
      </Row>
    </div>
  )
}
export default Selectors
