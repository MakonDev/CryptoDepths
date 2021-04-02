import React from 'react'
import Form from 'react-bootstrap/Form'

const ExchangeSelectors = ({ exchange, toggleExchange }) => {
  return (
    <Form.Control className='Exchange-Select' value={exchange} size='lg' as='select' onChange={e => toggleExchange(e.target.value)}>
      <option />
      <option value='Binance'>Binance</option>
      <option value='Coinbase'>Coinbase</option>
    </Form.Control>
  )
}

export default ExchangeSelectors
