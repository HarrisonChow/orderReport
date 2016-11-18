import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import Bar from './Bar';

export default class ReactChart extends React.Component {

  render() {
    let data = this.props.data

    let margin = {top: 20, right: 20, bottom: 10, left: 20},
      width = this.props.width - margin.left - margin.right,
      height = this.props.height - margin.top - margin.bottom;

    let allOrderAmount = data.map((d) => d.orderAmount)

    let x = d3.scaleLinear()
      .domain([0, d3.sum(data, (d) => d.orderAmount)])
      .range([0, width])

    let bars = []
    let length = 0
    let datatype,origintype

    data.forEach((datum, index) => {
      let typeReFormat = (datum.type).split(" ").join("");

      if (datum.type === 'orders') {
        let statusShow = (datum.status === '1')? "Processing " : (datum.status === '2')? "Delivery " : "Delivered "

          bars.push([<Bar key = {index} col = {datum.color} status = {datum.status} type = {typeReFormat} amount = {datum.orderAmount} x = {length} y = {5} width = {40} height = {x(datum.orderAmount)} fromDate = {this.props.fromDate} toDate = {this.props.toDate} dateRange = {this.props.dateR} />,
            <g>
            <text x = {125*index+20} y = "-10" fontSize = "12" fill = "black" > {statusShow} : {datum.orderAmount} </text>
            <rect x = {125*index} y = "-20" height = "10" width = "10" fill = {datum.color} fillOpacity = "0.6"/>
            </g>
          ])

      } else {
          bars.push([<Bar key = {index} col = {datum.color} status = {datum.status} type = {typeReFormat} logisticId = {datum.logisticId} amount = {datum.orderAmount} x = {length} y = {30} width = {40} height = {x(datum.orderAmount)} dateRange = {this.props.dateR} />,
            <g>
            <text x = {155*index+20} y = "20" fontSize = "12" fill = "black" > {datum.status} : {datum.orderAmount} </text>
            <rect x = {155*index} y = "10" height = "10" width = "10" fill = {datum.color} fillOpacity = "0.6" />
            </g>])
      }

      length = length + x(datum.orderAmount)
      origintype = datum.type
      datatype = typeReFormat
    })

    let total = d3.sum(data, (d) => d.orderAmount);

    return (
      <svg width = {this.props.width} height = {this.props.height} className = "scaling-svg" viewBox = {`0 0 650 120`}>
	      <g className = {datatype} transform = {`translate(${margin.left},${margin.top})`}>
        {datatype != 'orders' ||
          <text x = "560" y = "-10" fontSize = "12" fill = "black" > Total: {total}  </text>
        }
        {datatype != 'orders' &&
        <g>
          <text x = "0" y = "0" fontSize = "13" fill = "black"> {origintype} </text>,
          <text x = "560" y = "20" fontSize = "12" fill = "black" > Total: {total}  </text>
        </g>
        }
	        { bars }
	      </g>
      </svg>
    );
  }
}
