import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import ReactList from "react-list";

const pageSize = 3;

class OrderList extends React.Component {
  render() {
    return(
      <div className="container" >
        <h4>Order numbers list</h4>
        <select>
          <option value="7">Last 7 Days</option>
          <option value="3">Last 3 Days</option>
        </select>
        {this.props.viewer.orders.edges.map(edge =>
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
  initialVariables: {count: 2},
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
            cursor
          }
          pageInfo {
            hasNextPage,
            hasPreviousPage
          }
        }
      }
    `
  },
});
