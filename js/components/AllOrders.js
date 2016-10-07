import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';

const pageSize = 10;

class AllOrders extends React.Component {

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

      var titleDays = this.props.params.days;
      var titleStatus = this.props.params.status ==='any'? 'All':this.props.params.status;
      var pageTitle = this.props.params.status ? titleStatus + " orders list in last " + titleDays + " days": "All orders list";

    const prevButton = this.hasPreviousPage ? <button onClick={ this.prevPage.bind(this) }>Previous</button> : '';
    const nextButton = this.hasNextPage ? <button onClick={ this.nextPage.bind(this) }>Next</button> : '';

    return (
      <div>
        <div><h3>{pageTitle}</h3></div>
        <div>
          { this.parcelEdges().map(edge => <Parcel {...edge.node} key={ edge.node.__dataID__ } />) }
        </div>
        <div className="pageination">
          <span className="pageButton">{ prevButton }</span>
          <span className="pageButton">{ nextButton }</span>
        </div>
      </div>
    );
  }
}


const Parcel = props => {
  return (
    <div className="parcel">
      <div className="parcel-detail">
        <h4>{props.order_number}</h4>
      </div>
      <div className="parcel-detail">
        <h4>{props.status}</h4>
      </div>
      <div className="parcel-detail">
        <h4>{props.created_at}</h4>
      </div>
      <div className="parcel-detail">
        <Link to={`/orders/${props.order_number}`}><h4>detail</h4></Link>
      </div>
    </div>
  )
}


export default Relay.createContainer(AllOrders, {
  initialVariables: {
    first: pageSize,
    last: pageSize,
    after: null,
    before: null,
    next: true,
    prev: false,
    created_at: null,
    status: null
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        next: orders(created_at: $created_at, status: $status, first: $first, after: $after) @include(if: $next) {
          edges {
            cursor,
            node {
              id,
              order_number,
              created_at,
              updated_at,
              status,
            }
          },
          pageInfo{
            hasNextPage,
            hasPreviousPage,
            endCursor,
            startCursor,
          }
        },
        ordersAmount,
        processingOrdersAmount,
        deliveriedOrdersAmount,
        deliveryOrdersAmount,


        prev: orders(created_at: $created_at, status: $status, last: $last, before: $before) @include(if: $prev) {
          edges {
            cursor,
            node {
              id,
              order_number,
              created_at,
              updated_at,
              status,
            }
          },
          pageInfo{
            hasNextPage,
            hasPreviousPage,
            endCursor,
            startCursor,
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
