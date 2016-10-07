import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import moment from 'moment';
import ParcelList from './Parcels';

const pageSize = 4;

class LongOrderList extends React.Component {

  componentWillMount() {
    this.hasNextPage = this.props.viewer.next ? this.props.viewer.next.pageInfo.hasNextPage : false;
    this.hasPreviousPage = this.props.viewer.prev ? this.props.viewer.prev.pageInfo.hasPreviousPage : false;
  }

  componentWillReceiveProps(nextProps) {
    this.hasNextPage = nextProps.viewer.next ? nextProps.viewer.next.pageInfo.hasNextPage : this.hasNextPage;
    this.hasPreviousPage = nextProps.viewer.prev ? nextProps.viewer.prev.pageInfo.hasPreviousPage : this.hasPreviousPage;
  }

  nextPage() {
    this.hasPreviousPage = true;
    const pageInfo = this.props.viewer.next ? this.props.viewer.next.pageInfo : this.props.viewer.prev.pageInfo;
    const cursor = pageInfo.endCursor;
    this.props.relay.setVariables({ after: cursor, next: true, prev: false });
  }

  prevPage() {
    this.hasNextPage = true;
    const pageInfo = this.props.viewer.next ? this.props.viewer.next.pageInfo : this.props.viewer.prev.pageInfo;
    const cursor = pageInfo.startCursor;
    this.props.relay.setVariables({ before: cursor, next: false, prev: true });
  }

  parcelEdges() {
    return (this.props.viewer ?
      (this.props.viewer.next ? this.props.viewer.next.edges :
        (this.props.viewer.prev ? this.props.viewer.prev.edges : []))
      : [])
  }

  render() {

    const prevButton = this.hasPreviousPage ? <button onClick={ this.prevPage.bind(this) }>Previous</button> : '';
    const nextButton = this.hasNextPage ? <button onClick={ this.nextPage.bind(this) }>Next</button> : '';

    return (
      <div>
        <div><h3>List of Order processing longer than 7 days</h3></div>
        <div>
          { this.parcelEdges().map(edge => <LongOrder {...edge.node} key={ edge.node.__dataID__ } />) }
        </div>

        <div className="pageination">
          <span className="pageButton">{ prevButton }</span>
          <span className="pageButton">{ nextButton }</span>
        </div>
      </div>
    );
  }
}


const LongOrder = props => {
  return (
    <div className="order">
      <div className="order-detail">
        <h4>{props.order.order_number}</h4>
      </div>
      <div className="order-detail">
        <h4>{props.order.status}</h4>
      </div>
      <div className="order-detail">
        <Link to={`/orders/${props.order.order_number}`}><h4>detail</h4></Link>
      </div>
    </div>
  )
}

  export default Relay.createContainer(LongOrderList, {
    initialVariables: {
      first: pageSize,
      last: pageSize,
      after: null,
      before: null,
      next: true,
      prev: false,
      created_at: null
    },

    fragments: {
      viewer: () => Relay.QL`
        fragment on User {
          next: parcels(created_at: $created_at, first: $first, after: $after) @include(if: $next) {
            edges {
              cursor,
              node {
                id,
                tracking_number,
                status,
                created_at,
                order{
                  order_number,
                  status,
                }
              }
            },
            pageInfo{
              hasNextPage,
              hasPreviousPage,
              endCursor,
              startCursor,
            }
          },

          prev: parcels(created_at: $created_at,last: $last, before: $before) @include(if: $prev){
            edges {
              cursor,
              node {
                id,
                tracking_number,
                status,
                created_at,
                order{
                  order_number,
                  status,
                }
              }
            },
            pageInfo{
              hasNextPage,
              hasPreviousPage,
              endCursor,
              startCursor,
            }
          }
        }
      `
    },
  });
