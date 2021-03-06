import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, onCellClick} from 'material-ui/Table';
import FooterNavigation from './Footer';
import NavbarInstance from './Navigationbar';

const pageSize = 10;

class ParcelList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hoverable:true,
      stripedRows: true,
      showRowHover: false,
      showCheckboxes: false,
    };
  }

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

  cellClicked(rowNumber, columnId) {
    var trackingid = this.children[1].props.children;
    window.location = '#/parcels/'+trackingid;
  }

  render() {
    const prevButton = this.hasPreviousPage ? <FlatButton className = "backButton" label = "Back" onClick = { this.prevPage.bind(this) }/> : '';
    const nextButton = this.hasNextPage ? <RaisedButton className = "nextButton" primary = {true}  label = "Next"  onClick = { this.nextPage.bind(this) }/> : '';
    let logisticName = (this.props.logisticId === '1') ? 'Australia Post' : (this.props.logisticId === '2') ? 'Couriers Please' : 'TNT';
    let times = (this.props.days === '2') ? 'less than three days' : (this.props.days === '3') ? 'between three and five days' : 'more than five days';

    let title = (this.props.days) ? 'Parcels delivered by ' + logisticName + ' ' + times : 'All parcels list';
    return (
      <div>
        <NavbarInstance />
          <div className = "pagelayout">
            <Table>
              <TableHeader displaySelectAll = {this.state.showCheckboxes}
                adjustForCheckbox = {this.state.showCheckboxes}>
                <TableRow>
                  <TableHeaderColumn colSpan = "4" style = {{textAlign: 'center', fontSize: 15}}>
                    {title}
                  </TableHeaderColumn>
                </TableRow>
                <TableRow>
                  <TableHeaderColumn>ID</TableHeaderColumn>
                  <TableHeaderColumn>Tracking Number</TableHeaderColumn>
                  <TableHeaderColumn>Status</TableHeaderColumn>
                  <TableHeaderColumn>Created At</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox = {this.state.showCheckboxes}
                deselectOnClickaway = {this.state.deselectOnClickaway}
                showRowHover = {this.state.showRowHover}
                stripedRows = {this.state.stripedRows}>
                { this.parcelEdges().map(edge => <Parcel cellClicked = {this.cellClicked} state = {this.state} {...edge.node} key = { edge.node.__dataID__ } />) }
              </TableBody>
            </Table>
            <div className = "row pageButton">
              { prevButton }
              { nextButton }
            </div>
          </div>
        <FooterNavigation/>

      </div>
    );
  }
}


const Parcel = props => {
  let statusShow = (props.status === 1)? "Processing" : (props.status === 2)? "Delivery" : "Delivered"
  return (
    <TableRow hoverable = {props.state.hoverable} onCellClick = {props.cellClicked}>
      <TableRowColumn>{window.atob(props.id).match(/\d+$/)[0]}</TableRowColumn>
      <TableRowColumn>{props.tracking_number}</TableRowColumn>
      <TableRowColumn>{statusShow}</TableRowColumn>
      <TableRowColumn>{moment(props.created_datetime).format('LL')}</TableRowColumn>
    </TableRow>
  )
}


export default Relay.createContainer(ParcelList, {
  initialVariables: {
    first: pageSize,
    last: pageSize,
    after: null,
    before: null,
    next: true,
    prev: false,
    createdAt: null,
    logisticId: null,
    deliveryTime: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        next: parcels(createdAt: $createdAt, logisticId: $logisticId, deliveryTime: $deliveryTime, first: $first, after: $after) @include(if: $next) {
          edges {
            cursor,
            node {
              id,
              tracking_number,
              status,
              created_at,
              updated_at,
              delivery_time,
              created_datetime,
            }
          },
          pageInfo{
            hasNextPage,
            hasPreviousPage,
            endCursor,
            startCursor,
          }
        },

        prev: parcels(createdAt: $createdAt,logisticId: $logisticId, deliveryTime: $deliveryTime,last: $last, before: $before) @include(if: $prev){
          edges {
            cursor,
            node {
              id,
              tracking_number,
              status,
              created_at,
              updated_at,
              delivery_time,
              created_datetime,
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
