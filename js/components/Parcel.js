import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';

class ParcelDetails extends React.Component {
  render() {
    return (
        <div className="parcel">
          {this.props.viewer.parcels.edges
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
        <div>
          <div className="parcel-detail">
            <h4>Parcel Trancking Number: {edge.node.tracking_number}</h4>
          </div>
          <div className="parcel-detail">
            <h4>Parcel Status: {edge.node.status}</h4>
          </div>
          <div className="parcel-detail">
            <h4>Delivery Time: {edge.node.delivery_time} days</h4>
          </div>
          <div className="parcel-detail">
            <h4>Order Number: {edge.node.order.order_number}</h4>
          </div>
          <div className="parcel-detail">
            <h4>Logistic Name: {edge.node.logistic.name}</h4>
          </div>
        </div>
    )
  }
}

export default Relay.createContainer(ParcelDetails, {
  initialVariables: {
    tracking_number: null,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        parcels(tracking_number: $tracking_number, first: 9999) {
          edges {
            node {
              id,
              tracking_number,
              status,
              delivery_time,
              created_at,
              logistic{
                name
              },
              order{
                order_number
              },
            }
          }
        }
      }
    `
  },
});
