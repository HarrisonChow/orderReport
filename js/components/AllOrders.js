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
import SearchForm from './SearchForm'
	
const pageSize = 10;

class AllOrders extends React.Component {
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

  orderEdges() {
    return (this.props.viewer ?
      (this.props.viewer.next ? this.props.viewer.next.edges :
        (this.props.viewer.prev ? this.props.viewer.prev.edges : []))
      : [])
  }

  cellClicked(rowNumber, columnId) {
    var orderid = this.children[1].props.children;
    window.location = '#/orders/'+orderid;
  }

  render() {
    var titleDays = this.props.params.days;
    var titleStatus = (this.props.params.status ==='any') ? 'All': (this.props.params.status === '1') ? 'Processing' : (this.props.params.status === '2') ? 'Delivery' : 'Delivered' ;
    var pageTitle = (this.props.params.status && !this.props.from) ? titleStatus + " orders list in last " + titleDays + " days":
                    (this.props.params.status && this.props.from) ? titleStatus + " orders list from " + moment(this.props.from).format('ll') + " to " + moment(this.props.to).format('ll') :
                    "All orders list";
    const prevButton = this.hasPreviousPage ? <FlatButton className="backButton" label="Back" onClick={ this.prevPage.bind(this) }/> : '';
    const nextButton = this.hasNextPage ? <RaisedButton className="nextButton" primary={true}  label="Next"  onClick={ this.nextPage.bind(this) }/> : '';

    return (
      <div>
        <NavbarInstance />
          <div className = "pagelayout">
            <Table>
              <TableHeader displaySelectAll = {this.state.showCheckboxes}
                adjustForCheckbox = {this.state.showCheckboxes}>
                {/* <TableRow>
                  <TableHeaderColumn colSpan = "4" style = {{textAlign: 'center', fontSize: 15}}>
                    <SearchForm />
                  </TableHeaderColumn>
                </TableRow> */}
                <TableRow>
                  <TableHeaderColumn colSpan = "4" style = {{textAlign: 'center', fontSize: 15}}>
                    {pageTitle}
                  </TableHeaderColumn>
                </TableRow>
                <TableRow>
                  <TableHeaderColumn>ID</TableHeaderColumn>
                  <TableHeaderColumn>Order Number</TableHeaderColumn>
                  <TableHeaderColumn>Status</TableHeaderColumn>
                  <TableHeaderColumn>Invoice Date</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox = {this.state.showCheckboxes}
                deselectOnClickaway = {this.state.deselectOnClickaway}
                showRowHover = {this.state.showRowHover}
                stripedRows = {this.state.stripedRows}>
                { this.orderEdges().map(edge => <Order cellClicked={this.cellClicked} state={this.state} {...edge.node} key = { edge.node.__dataID__ } />) }
              </TableBody>
            </Table>
            <div className="row pageButton">
              { prevButton }
              { nextButton }
            </div>
          </div>
        <FooterNavigation />
      </div>
    );
  }
}

const Order = props => {
  let statusShow = (props.status === '1')? "Processing" : (props.status === '2')? "Delivery" : "Delivered"
  return (
    <TableRow hoverable = {props.state.hoverable} onCellClick = {props.cellClicked}>
      <TableRowColumn>{window.atob(props.id).match(/\d+$/)[0]}</TableRowColumn>
      <TableRowColumn>{props.invoice_number}</TableRowColumn>
      <TableRowColumn>{statusShow}</TableRowColumn>
      <TableRowColumn>{moment(props.invoice_date).format('LL')}</TableRowColumn>
    </TableRow>
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
    invoiceDate: null,
    status: null,
    fromDate: null,
    toDate: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        next: orders(invoiceDate: $invoiceDate, status: $status, fromDate: $fromDate,toDate: $toDate, first: $first, after: $after) @include(if: $next) {
          edges {
            cursor,
            node {
              id,
              invoice_number,
              invoice_date,
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
        deliveredOrdersAmount,
        deliveryOrdersAmount,


        prev: orders(invoiceDate: $invoiceDate, status: $status, fromDate: $fromDate,toDate: $toDate, last: $last, before: $before) @include(if: $prev) {
          edges {
            cursor,
            node {
              id,
              invoice_number,
              invoice_date,
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
        deliveredOrdersAmount,
        deliveryOrdersAmount,
      }
    `
  },
});
