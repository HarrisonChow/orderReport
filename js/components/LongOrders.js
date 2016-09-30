import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import moment from 'moment';
import ParcelList from './Parcels';

class LongOrderList extends React.Component {
  render() {
    let filterResult = this.props.viewer.parcels.edges
                  .filter(edge => {
                    let createAt = moment(edge.node.created_at).format('L');
                    let sevenDaysDate = moment().subtract(7, 'days').calendar();
                    return (moment(sevenDaysDate).isAfter(createAt)) && (edge.node.status != "Deliveried");
                  });
    return(
      <div className="container" >
        <h3>Order processing longer than 7 days list</h3>
        {filterResult.map(edge =>
          <LongOrder edge={edge} key={edge.node.id}/>
        )}
      </div>
    )
  }
}


class LongOrder extends React.Component {
  render() {
    var edge = this.props.edge;
    return (
        <div className="order">
          <div className="order-detail">
            <h4>{edge.node.order.order_number}</h4>
          </div>
          <div className="order-detail">
            <h4>{edge.node.order.status}</h4>
          </div>
          <div className="order-detail">
            <Link to={`/orders/${edge.node.order.order_number}`}><h4>detail</h4></Link>
          </div>
        </div>
    )
  }
}

export default Relay.createContainer(LongOrderList, {
  // initialVariables: {count: 15},
  // fragments: {
  //   viewer: () => Relay.QL`
  //     fragment on User {
  //       parcels(first: $count) {
  //         edges{
  //           node{
  //             id
  //             created_at
  //             status
  //             order{
  //               order_number
  //               status
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `
  // },
  // ${ParcelList.getFragment('viewer')}
  
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        parcels(first: 99999) {
          edges {
            node {
              id,
              tracking_number,
              status,
              created_at,
              order{
                order_number
                status
              }
            }
          }
        }
      }
    `
  },
});
