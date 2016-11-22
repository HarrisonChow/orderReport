import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FooterNavigation from './Footer';
import {IndexLink, Link} from 'react-router';
import NavbarInstance from './Navigationbar';
import SearchForm from './SearchForm'

const style = {
  bottomPaper: {
    textAlign: 'center',
    margin:20,
  }
};
class OrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverable:true,
      stripedRows: true,
      showRowHover: false,
      showCheckboxes: false,
    };
  }

  render() {
    return (
      <div>
        <NavbarInstance />
          <div className = "pagelayout">
            <div className="order">
            {this.props.viewer.orders.edges.length===0 &&
              <div>
                <div>Your search - {this.props.id} - did not match any orders.</div>
                <SearchForm />
              </div>

            }
              {this.props.viewer.orders.edges
                .map(edge =>
                <Detail showCheckboxes={this.state.showCheckboxes} edge={edge} key={edge.node.id}/>
              )}
            </div>
          </div>
        <FooterNavigation />
      </div>
    )
  }
}

class Detail extends React.Component {
  render() {
    var edge = this.props.edge;
    let statusShow = (edge.node.status === '1')? "Processing" : (edge.node.status === '2')? "Delivery" : "Delivered"

    return (
      <div>
        <Table>
          <TableBody displayRowCheckbox = {this.props.showCheckboxes}>
            <TableRow>
              <TableRowColumn>Order Number:</TableRowColumn>
              <TableRowColumn>{edge.node.invoice_number}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Order Status:</TableRowColumn>
              <TableRowColumn>{statusShow}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Invoice Date:</TableRowColumn>
              <TableRowColumn>{moment(edge.node.invoice_date).format('ll')}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Grand Total:</TableRowColumn>
              <TableRowColumn>{edge.node.grand_total}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Shipping Amount:</TableRowColumn>
              <TableRowColumn>{edge.node.shipping_amount}</TableRowColumn>
            </TableRow>
            <TableRow >
              <TableRowColumn>Billing Name:</TableRowColumn>
              <TableRowColumn>{edge.node.billing_firstname} {edge.node.billing_lastname}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Billing Email:</TableRowColumn>
              <TableRowColumn>{edge.node.billing_email}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Billing Phone:</TableRowColumn>
              <TableRowColumn>{edge.node.billing_phone}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Billing Address:</TableRowColumn>
              <TableRowColumn>{edge.node.billing_street} {edge.node.billing_suburb} {edge.node.billing_postcode} {edge.node.billing_state}</TableRowColumn>
            </TableRow>

          </TableBody>
        </Table>
        <div className = "moreDetails">
        {edge.node.parcels.edges.map(edge =>
          <Parcel showCheckboxes = {this.props.showCheckboxes} edge = {edge} key = {edge.node.id}/>
        )}
        </div>
      </div>
    )
  }
}

class Parcel extends React.Component {
  render() {
    var edge = this.props.edge;
    let statusShow = (edge.node.status === '1')? "Processing" : (edge.node.status === '2')? "Delivery" : "Delivered"
    return (
      <Paper zDepth={2} style = {style.bottomPaper}>
        <Table>
          <TableBody displayRowCheckbox = {this.props.showCheckboxes}>
            <TableRow>
              <TableRowColumn>Parcel Tracking Number:</TableRowColumn>
              <TableRowColumn><Link to = {`/parcels/${edge.node.tracking_number}`}>{edge.node.tracking_number}</Link></TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Parcel Status:</TableRowColumn>
              <TableRowColumn>{statusShow}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Logistic Company Name:</TableRowColumn>
              <TableRowColumn>{edge.node.logistic.name}</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default Relay.createContainer(OrderDetails, {
  initialVariables: {
    invoiceNumber: null,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders(invoiceNumber: $invoiceNumber, first: 9999) {
          edges {
            node {
              id,
              invoice_number,
              invoice_date,
              status,
              billing_firstname,
              billing_lastname,
              billing_email,
              billing_phone,
              billing_street,
              billing_suburb,
              billing_postcode,
              billing_state,
              grand_total,
              shipping_amount,
              parcels(first: 9999) {
                edges {
                  node {
                    id,
                    tracking_number,
                    status,
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
