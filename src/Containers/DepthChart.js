import React, { Component } from 'react'
import './DepthChart'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import Dropdown from 'react-bootstrap/Dropdown'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

// const baseUrl = 'https://api.binance.us/api/v3/'
// const endpoint = 'depth'
// const symbol = 'BTCUSD'
// const url = baseUrl + endpoint + '?symbol=' + symbol + '&limit=10'
// axios.get(url)
//   .then(data => console.log(data))
//   .catch(err => console.log(err))

am4core.useTheme(am4themes_animated)

class DepthChart extends Component {
  componentDidUpdate () {
    if (this.chart) {
      this.chart.dispose()
    }
    this.componentDidMount()
  }

  componentDidMount () {
    const chart = am4core.create('chartdiv', am4charts.XYChart)
    const base = this.props.options.base
    const quote = this.props.options.quote
    const limit = this.props.options.limit

    // Add data
    chart.dataSource.url = 'https://api.binance.us/api/v3/depth?symbol=' + base + quote + '&limit=' + limit
    chart.dataSource.reloadFrequency = 30000
    chart.dataSource.adapter.add('parsedData', function (data) {
      // Function to process (sort and calculate cummulative volume)
      function processData (list, type, desc) {
        // Convert to data points
        for (let i = 0; i < list.length; i++) {
          list[i] = {
            value: Number(list[i][0]),
            volume: Number(list[i][1])
          }
        }

        // Sort list just in case
        list.sort(function (a, b) {
          if (a.value > b.value) {
            return 1
          } else if (a.value < b.value) {
            return -1
          } else {
            return 0
          }
        })

        // Calculate cummulative volume
        if (desc) {
          for (let i = list.length - 1; i >= 0; i--) {
            if (i < (list.length - 1)) {
              list[i].totalvolume = list[i + 1].totalvolume + list[i].volume
            } else {
              list[i].totalvolume = list[i].volume
            }
            const dp = {}
            dp.value = list[i].value
            dp[type + 'volume'] = list[i].volume
            dp[type + 'totalvolume'] = list[i].totalvolume
            res.unshift(dp)
          }
        } else {
          for (let i = 0; i < list.length; i++) {
            if (i > 0) {
              list[i].totalvolume = list[i - 1].totalvolume + list[i].volume
            } else {
              list[i].totalvolume = list[i].volume
            }
            const dp = {}
            dp.value = list[i].value
            dp[type + 'volume'] = list[i].volume
            dp[type + 'totalvolume'] = list[i].totalvolume
            res.push(dp)
          }
        }
      }

      // Init
      const res = []
      processData(data.bids, 'bids', true)
      processData(data.asks, 'asks', false)

      return res
    })

    // Set up precision for numbers
    // chart.numberFormatter.numberFormat = '#,###.####'

    // Create axes
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'value'
    xAxis.fontSize = 11
    // xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.minGridDistance = 50
    xAxis.title.text = 'Price (' + base + '/' + quote + ')'
    xAxis.title.fontSize = 20
    xAxis.title.color = am4core.color('white')

    const yAxis = chart.yAxes.push(new am4charts.ValueAxis())
    yAxis.title.text = 'Volume'
    yAxis.fontSize = 12
    yAxis.color = am4core.color('white')

    // Create series
    const series = chart.series.push(new am4charts.StepLineSeries())
    series.dataFields.categoryX = 'value'
    series.dataFields.valueY = 'bidstotalvolume'
    series.fontSize = 15
    series.strokeWidth = 2
    series.stroke = am4core.color('#0f0')
    series.fill = series.stroke
    series.fillOpacity = 0.1
    series.tooltipText = 'Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{bidsvolume}[/]'

    const series2 = chart.series.push(new am4charts.StepLineSeries())
    series2.dataFields.categoryX = 'value'
    series2.dataFields.valueY = 'askstotalvolume'
    series2.strokeWidth = 2
    series2.stroke = am4core.color('#f00')
    series2.fill = series2.stroke
    series2.fillOpacity = 0.1
    series2.tooltipText = 'Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{asksvolume}[/]'

    const series3 = chart.series.push(new am4charts.ColumnSeries())
    series3.dataFields.categoryX = 'value'
    series3.dataFields.valueY = 'bidsvolume'
    series3.strokeWidth = 0
    series3.fill = am4core.color('white')
    series3.fillOpacity = 0.2
    series3.fontSize = 5

    const series4 = chart.series.push(new am4charts.ColumnSeries())
    series4.dataFields.categoryX = 'value'
    series4.dataFields.valueY = 'asksvolume'
    series4.strokeWidth = 0
    series4.fill = am4core.color('white')
    series4.fillOpacity = 0.2
    series4.fontSize = 5

    // Add cursor
    chart.cursor = new am4charts.XYCursor()

    this.chart = chart
  }

  componentWillUnmount () {
    if (this.chart) {
      this.chart.dispose()
    }
  }

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
        <div id='chartdiv' style={{ width: '100%', height: '500px' }} />
      </div>
    )
  }
}

export default DepthChart
