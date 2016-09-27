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

    let filtedDeliveriedResult = this.props.viewer.orders.edges.filter(edge => {
            let createAt = new Date(edge.node.created_at);
            let ostatus = edge.node.status;
            return (createAt.getTime() >= startDate.getTime())&&(edge.node.status==='Deliveried')
          });
    let filtedDeliveryResult = this.props.viewer.orders.edges.filter(edge => {
            let createAt = new Date(edge.node.created_at);
            let ostatus = edge.node.status;
            return (createAt.getTime() >= startDate.getTime())&&(edge.node.status==='Delivery')
          });
    let filtedProcessingResult = this.props.viewer.orders.edges.filter(edge => {
            let createAt = new Date(edge.node.created_at);
            let ostatus = edge.node.status;
            return (createAt.getTime() >= startDate.getTime())&&(edge.node.status==='Processing')
          });

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
        <div className="order-amount">
          <h4>Processing: {filtedProcessingResult.length}</h4>
          <h4>Delivery: {filtedDeliveryResult.length}</h4>
          <h4>Deliveried: {filtedDeliveriedResult.length}</h4>
          <h4>Total: {filtedDeliveriedResult.length+filtedDeliveryResult.length+filtedProcessingResult.length}</h4>
        </div>
        {this.props.viewer.orders.edges
          .filter(edge => {
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - dateRange);
            let createAt = new Date(edge.node.created_at);
            let ostatus = edge.node.status;
            // debugger;
            return createAt.getTime() >= startDate.getTime() ;
          })
          .map(edge =>
          <Order edge={edge} key={edge.node.id} onClick={this.props.OrderDetail}/>
        )}
      </div>
    )
  }
}

class Order extends React.Component {
  render() {
    var edge = this.props.edge;
    return (
        <div className="order">
          <div className="order-detail">
            <h4>{edge.node.order_number}</h4>
          </div>
          <div className="order-detail">
            <h4>{edge.node.status}</h4>
          </div>
          <div className="order-detail">
            <h4>{edge.node.created_at}</h4>
          </div>
          <div className="order-detail">
            <Link to={`/orders/${edge.node.order_number}`}>detail</Link>
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
