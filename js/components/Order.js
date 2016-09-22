import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
// import ReactList from "react-list";

const pageSize = 3;

class OrderList extends React.Component {
  state = { dateRange: 7 };

  onChange = event => {
    this.setState({ dateRange: parseInt(event.target.value)});
  }

  render() {
    let dateRange = this.state.dateRange;

    return(
      <div className="container" >
        <h3>Order numbers list</h3>
        <div className="order-amount">
          <h4>Total: {this.props.viewer.ordersAmount} orders </h4>
          <h4>Processing: {this.props.viewer.processingOrdersAmount} orders </h4>
          <h4>Complete: {this.props.viewer.completeOrdersAmount} orders </h4>
        </div>
        <div>
          <select onChange={this.onChange}>
            <option value="7" >Last 7 Days</option>
            <option value="10" >Last 10 Days</option>
          </select>
        </div>
        {this.props.viewer.orders.edges
          .filter(edge => {
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - dateRange);
            let createAt = new Date(edge.node.created_at);
            // debugger;
            return createAt.getTime() >= startDate.getTime();
          })
          .map(edge =>
          <Order edge={edge} key={edge.node.id}/>
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
        </div>
    )
  }
}

export default Relay.createContainer(OrderList, {
  initialVariables: {count: 10},
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
        completeOrdersAmount,
      }
    `
  },
});
