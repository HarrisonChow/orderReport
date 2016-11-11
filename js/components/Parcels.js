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
    let title = (this.props.created_at) ? "Parcel Processing longer than 7 days" : "All parcels list"
    return (
      <div>
      <NavbarInstance />
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
        <FooterNavigation/>

      </div>
    );
  }
}


const Parcel = props => {
  return (
    <TableRow hoverable = {props.state.hoverable} onCellClick = {props.cellClicked}>
      <TableRowColumn>{window.atob(props.id).match(/\d+$/)[0]}</TableRowColumn>
      <TableRowColumn>{props.tracking_number}</TableRowColumn>
      <TableRowColumn>{props.status}</TableRowColumn>
      <TableRowColumn>{moment(props.created_at).format('LL')}</TableRowColumn>
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
    created_at: null,
    logistic_id: null,
    delivery_time: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        next: parcels(created_at: $created_at, logistic_id: $logistic_id, delivery_time: $delivery_time, first: $first, after: $after) @include(if: $next) {
          edges {
            cursor,
            node {
              id,
              tracking_number,
              status,
              created_at,
              updated_at,
              delivery_time,
            }
          },
          pageInfo{
            hasNextPage,
            hasPreviousPage,
            endCursor,
            startCursor,
          }
        },

        prev: parcels(created_at: $created_at,logistic_id: $logistic_id, delivery_time: $delivery_time,last: $last, before: $before) @include(if: $prev){
          edges {
            cursor,
            node {
              id,
              tracking_number,
              status,
              created_at,
              updated_at,
              delivery_time,
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
