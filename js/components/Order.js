import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';

class OrderDetails extends React.Component {
  render() {
    return (
        <div className="order">
          {this.props.viewer.orders.edges
            .map(edge =>
            <Detail edge={edge} key={edge.node.id}/>
          )}
        </div>
    )
  }
}

class Detail extends React.Component {
  render() {
    var edge = this.props.edge;
    return (
        <div >
          <div className="order-detail">
            <h4>Order Number: {edge.node.order_number}</h4>
          </div>
          <div className="order-detail">
            <h4>Order Status: {edge.node.status}</h4>
          </div>
          <div className="order-detail">
            <h4>Created At: {edge.node.created_at}</h4>
          </div>
          <div className="order-detail">
            {edge.node.parcels.edges.map(edge =>
              <Parcel edge={edge} key={edge.node.id}/>
            )}
          </div>
        </div>
    )
  }
}

class Parcel extends React.Component {
  render() {
    var edge = this.props.edge;
    return (
      <div>
        <div><h4>Parcel Trancking Number: {edge.node.tracking_number}</h4></div>
        <div><h4>Parcel Status: {edge.node.status}</h4></div>
        <div><h4>Parcel Delivery Time: {edge.node.delivery_time}</h4></div>
        <div><h4>Logistic Company: {edge.node.logistic.name}</h4></div>
      </div>
    )
  }
}


export default Relay.createContainer(OrderDetails, {
  initialVariables: {
    order_number: null,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders(order_number: $order_number, first: 9999) {
          edges {
            node {
              id,
              order_number,
              created_at,
              status,
              parcels(first: 9999) {
                edges {
                  node {
                    id,
                    tracking_number,
                    status,
                    delivery_time,
                    logistic{
                      name
                    }
                  }
                }
              },
            }
          }
        }
      }
    `
  },
});
