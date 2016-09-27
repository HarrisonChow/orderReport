import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';

class ParcelList extends React.Component {
  render() {
    return(
      <div className="container" >
        <h4>Parcels list</h4>
        {this.props.viewer.parcels.edges.map(edge =>
          <Parcel edge={edge} key={edge.node.id}/>
        )}
      </div>
    )
  }
}

class Parcel extends React.Component {
  render() {
    var edge = this.props.edge;
    return (
        <div className="parcel">
          <div className="parcel-detail">
            <h4>{edge.node.tracking_number}</h4>
          </div>
          <div className="parcel-detail">
            <h4>{edge.node.status}</h4>
          </div>
          <div className="parcel-detail">
            <Link to={`/parcels/${edge.node.tracking_number}`}>detail</Link>
          </div>
        </div>
    )
  }
}

export default Relay.createContainer(ParcelList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        parcels(first: 99999) {
          edges {
            node {
              id,
              tracking_number,
              status,
            }
          }
        }
      }
    `
  },
});
