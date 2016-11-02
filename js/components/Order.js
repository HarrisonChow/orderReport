import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


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
      <div className="order">
        {this.props.viewer.orders.edges
          .map(edge =>
          <Detail showCheckboxes={this.state.showCheckboxes} edge={edge} key={edge.node.id}/>
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
        <Table>
          <TableBody displayRowCheckbox = {this.props.showCheckboxes}>
            <TableRow>
              <TableRowColumn>Order Number:</TableRowColumn>
              <TableRowColumn>{edge.node.order_number}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Order Status:</TableRowColumn>
              <TableRowColumn>{edge.node.status}</TableRowColumn>
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
              <TableRowColumn>{edge.node.status}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Parcel Delivery Time:</TableRowColumn>
              <TableRowColumn>{edge.node.delivery_time}</TableRowColumn>
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
    order_number: null,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders(order_number: $order_number, first: 9999) {
          edges {
            node {
              id,
              order_number,
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
