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
    let datatype

    data.forEach((datum, index) => {
      bars.push(<Bar key={index} col={datum.color} status={datum.status} type = {datum.type} amount={datum.orderAmount} x={length} y={5} width={40} height={x(datum.orderAmount)} dateRange = {this.props.dateR} />)
      length = length + x(datum.orderAmount)
      datatype = datum.type
    })

    let total = d3.sum(data, (d) => d.orderAmount);

    return (
      <svg width={this.props.width} height={this.props.height}>
	      <g className={datatype} transform={`translate(${margin.left},${margin.top})`}>
          {datatype !='orders' ||
          <g>
            <rect x="0" y="-20" height="10" width="10" fill="black" />,
            <text x="20" y="-10" fontSize="12" fill="black" > Procesing orders </text>,
            <rect x="150" y="-20" height="10" width="10" fill="brown" />,
            <text x="170" y="-10" fontSize="12" fill="black" > Delivery orders </text>,
            <rect x="300" y="-20" height="10" width="10" fill="steelblue" />,
            <text x="320" y="-10" fontSize="12" fill="black" > Deliveried orders </text>,
            <text x="560" y="-10" fontSize="12" fill="black" > Total: {total}  </text>
          </g>
          }
          {datatype !='orders' &&
          <g>
            <text x="20" y="-10" fontSize="13" fill="black"> {datatype} </text>,
            <text x="560" y="-10" fontSize="12" fill="black" > Total: {total}  </text>
          </g>
          }
	        { bars }
	      </g>
      </svg>
    );
  }
}
