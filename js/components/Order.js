import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';

class OrderList extends React.Component {
  render() {
    return(
      <div className="container" >
        <h4>Order numbers list</h4>
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
      <div className="col-sm-4">
        <div className="panel panel-default">
          <div className="panel-heading" >
            <h4>{edge.node.order_number}</h4> {edge.node.status}
          </div>
          <div className="panel-body">
            <h5>{edge.node.created_at}</h5>
          </div>
        </div>
      </div>
    )
  }
}


export default Relay.createContainer(OrderList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders(first: 99999) {
          edges {
            node {
              id,
              order_number,
              created_at,
              status,
            }
          }
        }
      }
    `
  },
});
