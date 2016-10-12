import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import moment from 'moment';

// const pageSize = 3;
class OrderList extends React.Component {

  state = { dateRange: 7 };

  onChange = event => {
    this.setState({ dateRange: parseInt(event.target.value)});
  }

  render() {
    let dateRange = this.state.dateRange;
    let filterResult = this.props.viewer.orders.edges
                        .filter(edge => {
                          let selectDateRange = moment().subtract(dateRange, 'days').calendar();
                          let createDate = edge.node.created_at;
                          return createDate >= selectDateRange ;
                        });
    let filtedDeliveriedResult = filterResult.filter(edge => {return edge.node.status==='Deliveried'});
    let filtedDeliveryResult = filterResult.filter(edge => {return edge.node.status==='Delivery'});
    let filtedProcessingResult = filterResult.filter(edge => {return edge.node.status==='Processing'});

    var result = "Click to check all orders list in last " + dateRange + " days";


    let daysForLogis = 0;
    if (!event.target.value) {
      daysForLogis = 7
    } else {
      daysForLogis = event.target.value
    }

    let sevenDaysDate = 7;

    let data = [
      {status: 'Processing', orderAmount: filtedProcessingResult.length, color: 'black'},
      {status: 'Delivery', orderAmount: filtedDeliveryResult.length, color: 'brown'},
      {status: 'Deliveried', orderAmount: filtedDeliveriedResult.length, color: 'steelblue'},
      ]

    return(

      <div className="container" >
          <header className="header">
            <h2>
              Sydney Tools Order Report
            </h2>
          </header>
        <div className="order-amount">
          <h4>Processing orders: {this.props.viewer.processingOrdersAmount}  </h4>
          <h4>Delivery orders: {this.props.viewer.deliveryOrdersAmount}  </h4>
          <h4>Deliveried orders: {this.props.viewer.deliveriedOrdersAmount}  </h4>
          <h4>Total: {this.props.viewer.ordersAmount} </h4>
        </div>
        <div className="daysSelection">
          <select onChange={this.onChange} id="soflow">
            <option value="7" >Last 7 Days</option>
            <option value="10" >Last 10 Days</option>
            <option value="160" >Last 160 Days</option>
          </select>
        </div>
        {filterResult.length !=0 &&
        <div className="order-amount">
          <h4>Processing: <Link to={`/allOrders/${dateRange}/Processing`}>{filtedProcessingResult.length}</Link></h4>
          <h4>Delivery: <Link to={`/allOrders/${dateRange}/Delivery`}>{filtedDeliveryResult.length}</Link></h4>
          <h4>Deliveried: <Link to={`/allOrders/${dateRange}/Deliveried`}>{filtedDeliveriedResult.length}</Link></h4>
          <h4>Total: <Link to={`/allOrders/${dateRange}/any`}>{filterResult.length}</Link></h4>
        </div>
        }
        {filterResult.length !=0 &&
        <div><ReactChart width={650} height={100} data={data} dateR= {dateRange}/></div>
        }

        {filterResult.length !=0 &&
        <div className="order-amount spaces">
          <h4><Link to={`/allOrders/${dateRange}/any`}>{result}</Link></h4>
        </div>
        }
        <div className="order-amount"><h4><Link to={`/logistics/${daysForLogis}`}>Logistic Stastics in last {daysForLogis} days.</Link> </h4></div>
        <div className="order-amount"><h4><Link to={`/longorders/${sevenDaysDate}`}>Order processing longer than 7 Days</Link></h4></div>
        <div className="order-amount"><h4><Link to="/fastThreeDays">The fastest 3 Days</Link></h4></div>
        <div className="order-amount"><h4><Link to="/slowestSevenDays">The slowest 7 Days</Link></h4></div>
        <div className="spaces"></div>


      </div>
    )
  }
}


class Bar extends React.Component {

  render() {
    let style = {
      fill: this.props.col
    }
    return(
	      <Link to={`/allOrders/${this.props.dateRange}/${this.props.status}`}>
          <rect className="bar" style={style} x={this.props.x} y={this.props.y} height={this.props.width} width={this.props.height} />
          <text x={this.props.x+5} y={this.props.y+15} fontSize="12" fill="white" > {this.props.status} </text>
          <text x={this.props.x+this.props.height-15} y={this.props.y+35} fontSize="12" fill="white" > {this.props.amount} </text>
        </Link>
    )
  }
}



class ReactChart extends React.Component {

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
    data.forEach((datum, index) => {
      bars.push(<Bar key={index} col={datum.color} status={datum.status} amount={datum.orderAmount} x={length} y={5} width={40} height={x(datum.orderAmount)} dateRange = {this.props.dateR} />)
      length = length + x(datum.orderAmount)
    })
    let total = d3.sum(data, (d) => d.orderAmount);

    return (
      <svg width={this.props.width} height={this.props.height}>
	      <g className="chart" transform={`translate(${margin.left},${margin.top})`}>
          <rect x="0" y="-20" height="10" width="10" fill="black" />
          <text x="20" y="-10" fontSize="12" fill="black" > Procesing orders </text>
          <rect x="150" y="-20" height="10" width="10" fill="brown" />
          <text x="170" y="-10" fontSize="12" fill="black" > Delivery orders </text>
          <rect x="300" y="-20" height="10" width="10" fill="steelblue" />
          <text x="320" y="-10" fontSize="12" fill="black" > Deliveried orders </text>
          <text x="560" y="-10" fontSize="12" fill="black" > Total: {total}  </text>
	        { bars }
	      </g>
      </svg>
    );
  }
}


export default Relay.createContainer(OrderList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders(first: 1000) {
          edges {
            cursor,
            node {
              id,
              order_number,
              created_at,
              updated_at,
              status,
            }
          },
          pageInfo{
            hasNextPage,
            hasPreviousPage,
            endCursor,
            startCursor,
          }
        },
        ordersAmount,
        processingOrdersAmount,
        deliveriedOrdersAmount,
        deliveryOrdersAmount,
      }
    `
  },
});
