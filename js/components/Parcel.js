import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {IndexLink, Link} from 'react-router';
import FooterNavigation from './Footer';
import NavbarInstance from './Navigationbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import trackingDetails from '../../scripts/showTrackingDetails';

const style = {
  bottomPaper: {
    textAlign: 'center',
    margin:20,
  },
  dialogStyle: {
  position: "absolute",
  top:0,
  left: '25vw',
  right: '25vw',
  width: '50vw'
  },
  trackingButton: {
    backgroundColor: 'rgba(233, 30, 99, 0.6)',
    marginLeft: 35,
    width:'70%'
  },
  box: {
    boxShadow:0
  },
  labels : {
    paddingLeft:0,
    paddingRight:0
  }

};


class ParcelDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverable:true,
      stripedRows: true,
      showRowHover: false,
      showCheckboxes: false,
      open: false,
    };
  }

  handleOpen = () => {
    let carrierName = this.props.viewer.parcels.edges[0].node.carrier;
    trackingDetails(this.props.id, carrierName);
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
        <div>
          <NavbarInstance />
            <div className = "pagelayout">
              <Dialog
                title="Delivery tracking details"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
                contentStyle={style.dialogStyle}
              >
                <div id = "details"></div>
              </Dialog>
              <div className="parcel">
                {this.props.viewer.parcels.edges
                  .map(edge =>
                  <Detail showCheckboxes={this.state.showCheckboxes} handleOpen={this.handleOpen} edge={edge} key={edge.node.id}/>
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
    let statusShow = (edge.node.status === '1')? "Processing" : (edge.node.status === '2')? "Delivery" : "Delivered";
    var deliveryTimeShow = moment(edge.node.delivery_time).format('YYYY-MM-DD');

    return (
      <div>
        <Table>
          <TableBody displayRowCheckbox = {this.props.showCheckboxes}>
            <TableRow>
              <TableRowColumn>Parcel Tracking Number:</TableRowColumn>
              <TableRowColumn>{edge.node.tracking_number} <RaisedButton style= {style.box} labelStyle={style.labels} buttonStyle={style.trackingButton} label="Track" onTouchTap={this.props.handleOpen} /></TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Parcel Status:</TableRowColumn>
              <TableRowColumn>{statusShow}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Delivery Time:</TableRowColumn>
                <TableRowColumn>{deliveryTimeShow}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Packed by:</TableRowColumn>
                <TableRowColumn>{edge.node.packed_by}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Shipping Name:</TableRowColumn>
                <TableRowColumn>{edge.node.shipping_firstname} {edge.node.shipping_lastname}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Shipping Email:</TableRowColumn>
                <TableRowColumn>{edge.node.shipping_email}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Shipping Phone:</TableRowColumn>
                <TableRowColumn>{edge.node.shipping_phone}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Shipping address:</TableRowColumn>
                <TableRowColumn>{edge.node.shipping_street} {edge.node.shipping_suburb} {edge.node.shipping_postcode} {edge.node.shipping_state}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Logistic Name:</TableRowColumn>
              <TableRowColumn>{edge.node.logistic.name}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Order Number:</TableRowColumn>
              <TableRowColumn><Link to = {`/orders/${edge.node.order.invoice_number}`}>{edge.node.order.invoice_number}</Link></TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Order Invoice Date:</TableRowColumn>
              <TableRowColumn>{moment(edge.node.order.invoice_date).format('YYYY-MM-DD')}</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default Relay.createContainer(ParcelDetails, {
  initialVariables: {
    trackingNumber: null,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        parcels(trackingNumber: $trackingNumber, first: 9999) {
          edges {
            node {
              id,
              tracking_number,
              status,
              delivery_time,
              packed_by,
              carrier,
              shipping_firstname,
              shipping_lastname,
              shipping_email,
              shipping_phone,
              shipping_street,
              shipping_suburb,
              shipping_postcode,
              shipping_state,
              logistic{
                name
              },
              order{
                invoice_number
                invoice_date
              },
            }
          }
        }
      }
    `
  },
});
