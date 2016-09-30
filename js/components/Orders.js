import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';

// const pageSize = 3;
class OrderList extends React.Component {

  state = { dateRange: 7 };

  onChange = event => {
    this.setState({ dateRange: parseInt(event.target.value)});
  }

  render() {
    let dateRange = this.state.dateRange;
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
    let filterResult = this.props.viewer.orders.edges
                        .filter(edge => {
                          let createAt = new Date(edge.node.created_at);
                          return createAt.getTime() >= startDate.getTime() ;
                        });

    let filtedDeliveriedResult = filterResult.filter(edge => {return edge.node.status==='Deliveried'});
    let filtedDeliveryResult = filterResult.filter(edge => {return edge.node.status==='Delivery'});
    let filtedProcessingResult = filterResult.filter(edge => {return edge.node.status==='Processing'});

    var result = "All orders list in last " + dateRange + " days";
    if (this.props.params.status === "processing") {
      filterResult = filtedProcessingResult;
      result = "Processing orders list in last " + dateRange + " days";
    } else if (this.props.params.status === "delivery") {
      filterResult = filtedDeliveryResult;
      result = "Delivery orders list in last " + dateRange + " days";
    } else if (this.props.params.status === "deliveried"){
      filterResult = filtedDeliveriedResult;
      result = "Deliveried orders list in last " + dateRange + " days";
    }

    let daysForLogis = 0;
    if (!event.target.value) {
      daysForLogis = 365
    } else {
      daysForLogis = event.target.value
    }
    return(

      <div className="container" >
        <h3>Order numbers list</h3>
        <div className="order-amount">
          <h4>Processing: {this.props.viewer.processingOrdersAmount} orders </h4>
          <h4>Delivery: {this.props.viewer.deliveryOrdersAmount} orders </h4>
          <h4>Deliveried: {this.props.viewer.deliveriedOrdersAmount} orders </h4>
          <h4>Total: {this.props.viewer.ordersAmount} orders </h4>
        </div>
        <div>
          <select onChange={this.onChange}>
            <option value="7" >Last 7 Days</option>
            <option value="10" >Last 10 Days</option>
            <option value="160" >Last 160 Days</option>
          </select>
        </div>
        <div className="order-amount"><h4><Link to={`/logistics/${daysForLogis}`}>Logistic Stastics in last {daysForLogis} days.</Link> </h4></div>
        <div className="order-amount"><h4><Link to="/longorders">Order processing longer than 7 Days</Link></h4></div>

        <div className="order-amount">
          <h4>Processing: <Link to="/ordercheck/processing">{filtedProcessingResult.length}</Link></h4>
          <h4>Delivery: <Link to="/ordercheck/delivery">{filtedDeliveryResult.length}</Link></h4>
          <h4>Deliveried: <Link to="/ordercheck/deliveried">{filtedDeliveriedResult.length}</Link></h4>
        </div>
        <div className="order-amount">
          <h4>{result}</h4>
        </div>
        {filterResult.map(edge =>
          <Order edge={edge} key={edge.node.id}/>
        )}
      </div>
    )
  }
}

class Order extends React.Component {
  render() {
    var order = this.props.edge.node;
    return (
        <div className="order">
          <div className="order-detail">
            <h4>{order.order_number}</h4>
          </div>
          <div className="order-detail">
            <h4>{order.status}</h4>
          </div>
          <div className="order-detail">
            <h4>{order.created_at}</h4>
          </div>
          <div className="order-detail">
            <Link to={`/orders/${order.order_number}`}><h4>detail</h4></Link>
          </div>
        </div>
    )
  }
}

export default Relay.createContainer(OrderList, {
  initialVariables: {count: 15},
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders(first: $count) {
          edges {
            node {
              id,
              order_number,
              created_at,
              updated_at,
              status,
            }
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
