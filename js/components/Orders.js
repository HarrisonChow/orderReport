import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import moment from 'moment';
import ReactChart from './ReactChart';
import Badge from 'material-ui/Badge';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import FooterNavigation from './Footer';
import NavbarInstance from './Navigationbar';
import SearchBox from './Search'


const style = {
  bottomPaper: {
    textAlign: 'center',
    padding: 25
  }
};

moment.createFromInputFallback = function(config) {
  config._d = new Date(config._i);
};

class OrderList extends React.Component {

  constructor(props) {
    super(props);
    const minDate = new Date();
    const maxDate = new Date();

    minDate.setFullYear( minDate.getFullYear() - 1 );
    minDate.setHours( 0, 0, 0, 0 );
    maxDate.setFullYear( maxDate.getFullYear() + 1 );
    maxDate.setHours( 0, 0, 0, 0 );

    this.state = {
      value: 7,
      minDate: minDate,
      maxDate: maxDate,
      autoOk: true,
      disableYearSelection: false,
      displayDatePicker: false,
    };
  }
  reRender( x, y ){
    window.location = '#/orders/'+x+'/'+y;
  }

  handleChangeDate = ( type, event, date ) => {
    let fromDate = this.state.minDate;
    let toDate = this.state.maxDate;
    switch ( type ) {
      case 'minDate':
        {
          this.setState({
          minDate: date,
          });
          fromDate = this.state.minDate;
          this.reRender( fromDate, toDate );
        }
        break;
      case 'maxDate':
        {
          this.setState( {
          maxDate: date,
          });
          toDate = this.state.maxDate;
          this.reRender( fromDate, toDate );
        }
        break;
      default:
        throw new Error( 'Unimplemented type' );
    }
  };

  handleChange = ( event, index, value ) => {
    let fromDate, toDate;
    if ( value === 'customize' ) {
      this.setState({ value,displayDatePicker:true, });
      this.reRender(this.state.minDate, this.state.maxDate);
    } else{
      this.setState({ value,displayDatePicker:false, });
      toDate = new Date();
      let getDate = moment().subtract( value, 'days' ).calendar();
      let getDateUtc = moment( getDate ).utc();
      fromDate = new Date( getDateUtc.format() );
      this.reRender( fromDate, toDate );
    }
  }

  render() {

    let dateRange = this.state.value;
    let minD = this.state.minDate;
    let maxD = this.state.maxDate;
    let finalResult = this.props.viewer.orders.edges;
    let filtedDeliveriedResult = finalResult.filter(edge => {return edge.node.status === 'Deliveried'});
    let filtedDeliveryResult = finalResult.filter(edge => {return edge.node.status === 'Delivery'});
    let filtedProcessingResult = finalResult.filter(edge => {return edge.node.status === 'Processing'});

    let selectDays = (!event) ? 7 : dateRange;
    let sevenDaysDate = 7;
    let buttonText = (dateRange === 'customize') ? ' from ' + moment(minD).format('ll') + ' to ' + moment(maxD).format('ll') : ' in last '+ selectDays + ' days';
    let buttonhrefOne = (dateRange === 'customize') ? '#/logistics/' + moment(minD).format('ll') + '/'+moment(maxD).format('ll') : '#/logistics/'+ selectDays;
    let buttonhrefTwo = (dateRange === 'customize') ? '#/OrdersByRange/'+ moment(minD).format('ll') + '/'+ moment(maxD).format('ll') : '#/allOrders/' + dateRange + '/any';

    let data = [
      {type: 'orders', status: 'Processing', orderAmount: filtedProcessingResult.length, color: '#98abc5'},
      {type: 'orders', status: 'Delivery', orderAmount: filtedDeliveryResult.length, color: '#a05d56'},
      {type: 'orders', status: 'Deliveried', orderAmount: filtedDeliveriedResult.length, color: '#ff8c00'},
    ]


    return(

      <div className = "row" >
        <div className = "row">
        <NavbarInstance click = {this.state}/>
          <div className = "col-xs-offset-1 col-xs-10 allButtons">
            <RaisedButton className = "mainBtn" label = "Processing Longer Than 7 Days" primary = {true} href = {`#/longorders/${sevenDaysDate}`}/>
            <RaisedButton className = "mainBtn" label = "Fastest 3 Days" primary = {true} href = "#/speedcheck/fastest/3"/>
            <RaisedButton className = "mainBtn" label = "Slowest 7 Days" primary = {true} href = "#/speedcheck/slowest/7"/>
            <SearchBox />
          </div>
          <div className = "col-xs-offset-1 col-xs-10 allButtons">
            <Paper zDepth = { 1 } style={ style.bottomPaper }>
            { this.state.displayDatePicker ?
                <div>
                  <div className = "col-xs-3">
                    <DatePicker
                      onChange = { this.handleChangeDate.bind( this, 'minDate' ) }
                      autoOk = { this.state.autoOk }
                      floatingLabelText = "From"
                      defaultDate = { this.state.minDate }
                      disableYearSelection = { this.state.disableYearSelection }
                      style = {{ fontWeight: 800 }}
                      textFieldStyle = {{ top: -11 }}
                    />
                  </div>
                  <div className = "col-xs-3">
                    <DatePicker
                      onChange = { this.handleChangeDate.bind(this, 'maxDate') }
                      autoOk = { this.state.autoOk }
                      floatingLabelText = "To"
                      defaultDate = { this.state.maxDate }
                      disableYearSelection = { this.state.disableYearSelection }
                      style = {{ fontWeight: 800 }}
                      textFieldStyle = {{ top: -11 }}
                    />
                  </div>
                </div>
            : null }

              <DropDownMenu
                value = { this.state.value }
                onChange = { this.handleChange.bind(this) }
                animation = { PopoverAnimationVertical }
                className = "mainBtns"
                style = {{ width: "30%", fontSize: "20px" }}
              >
                <MenuItem value = { 7 } primaryText = "Last 7 Days" />
                <MenuItem value = { 10 } primaryText = "Last 10 Days" />
                <MenuItem value = { 27 } primaryText = "Last 27 Days" />
                <MenuItem value = { 30 } primaryText = "Last 30 Days" />
                <MenuItem value = { 60 } primaryText = "Last 60 Days" />
                <MenuItem value = { 180 } primaryText = "Last 180 Days" />
                <MenuItem value = { 'customize' } primaryText = "Customization" />
              </DropDownMenu>

              {finalResult.length != 0 &&
              <div className = "orderStastic">
                <ReactChart width = { 650 } height = { 120 } data = { data } dateR = { dateRange } fromDate = {( new Date( minD ) )} toDate={( new Date( maxD ) )}/>
                <div>
                  <RaisedButton label = { `Logistic Stastics ` + buttonText } primary = { true } className = 'badges' href = { buttonhrefOne }/>
                  <RaisedButton label = { `Orders List `+ buttonText } secondary={ true } className = 'badges' href = { buttonhrefTwo }/>
                </div>
              </div>
            }
            </Paper>
          </div>
          <FooterNavigation click = {this.state}/>
        </div>
      </div>

    )
  }
}

export default Relay.createContainer(OrderList, {
  initialVariables: {
    toDate: new Date(),
    fromDate: new Date( ( moment( moment().subtract( 7, 'days' ).calendar() ).utc() ).format() ),
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders( fromDate: $fromDate, toDate: $toDate, first: 1000 ) {
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
          pageInfo {
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
