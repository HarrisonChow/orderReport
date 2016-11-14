import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FooterNavigation from './Footer';
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
    console.log(this);
    return (
      <div>
        <NavbarInstance />
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
        <FooterNavigation />
      </div>
    )
  }
}

class Detail extends React.Component {
  render() {
    var edge = this.props.edge;
    let statusShow = (edge.node.status === '1')? "Processing" : (edge.node.status === '2')? "Delivery" : "Deliveried"

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
              <TableRowColumn>Created At:</TableRowColumn>
              <TableRowColumn>{moment(edge.node.created_at).format('ll')}</TableRowColumn>
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
    if (edge.node.delivery_time) {
      var deliveryTimeShow = moment(edge.node.delivery_time).format('YYYY-MM-DD');
    } else {
      var deliveryTimeShow = '';
    }
    let statusShow = (edge.node.status === '1')? "Processing" : (edge.node.status === '2')? "Delivery" : "Deliveried"
    return (
      <Paper zDepth={2} style = {style.bottomPaper}>
        <Table>
          <TableBody displayRowCheckbox = {this.props.showCheckboxes}>
            <TableRow>
              <TableRowColumn>Parcel Tracking Number:</TableRowColumn>
              <TableRowColumn>{edge.node.tracking_number}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Parcel Status:</TableRowColumn>
              <TableRowColumn>{statusShow}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Parcel Delivery Time:</TableRowColumn>
              <TableRowColumn>{deliveryTimeShow}</TableRowColumn>
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
