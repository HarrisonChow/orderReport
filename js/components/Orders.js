import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import moment from 'moment';

// const pageSize = 3;
class OrderList extends React.Component {

  state = { dateRange: 7 };

  onChange = event => {
    this.setState({ dateRange: parseInt(event.target.value)});
  }

  render() {
    let dateRange = this.state.dateRange;
    let startDate = new Date();
    var oneDay = 24*60*60*1000;
    let filterResult = this.props.viewer.orders.edges
                        .filter(edge => {
                          var createDate = new Date(edge.node.created_at);
                          var diffDays = Math.round(Math.abs((startDate.getTime() - createDate.getTime())/(oneDay)));
                          return diffDays <= dateRange ;
                        });
    let filtedDeliveriedResult = filterResult.filter(edge => {return edge.node.status==='Deliveried'});
    let filtedDeliveryResult = filterResult.filter(edge => {return edge.node.status==='Delivery'});
    let filtedProcessingResult = filterResult.filter(edge => {return edge.node.status==='Processing'});

    var result = "Click to check all orders list in last " + dateRange + " days";


    let daysForLogis = 0;
    if (!event.target.value) {
      daysForLogis = 7
    } else {
      daysForLogis = event.target.value
    }

    let sevenDaysDate = 7;

    return(

      <div className="container" >
          <header className="header">
            <h2>
              Sydney Tools Order Report
            </h2>
          </header>
        <div className="order-amount">
          <h4>Processing orders: {this.props.viewer.processingOrdersAmount}  </h4>
          <h4>Delivery orders: {this.props.viewer.deliveryOrdersAmount}  </h4>
          <h4>Deliveried orders: {this.props.viewer.deliveriedOrdersAmount}  </h4>
          <h4>Total: {this.props.viewer.ordersAmount} </h4>
        </div>
        <div className="daysSelection">
          <select onChange={this.onChange} id="soflow">
            <option value="7" >Last 7 Days</option>
            <option value="10" >Last 10 Days</option>
            <option value="160" >Last 160 Days</option>
          </select>
        </div>
        {filterResult.length !=0 &&
        <div className="order-amount">
          <h4>Processing: <Link to={`/allOrders/${dateRange}/Processing`}>{filtedProcessingResult.length}</Link></h4>
          <h4>Delivery: <Link to={`/allOrders/${dateRange}/Delivery`}>{filtedDeliveryResult.length}</Link></h4>
          <h4>Deliveried: <Link to={`/allOrders/${dateRange}/Deliveried`}>{filtedDeliveriedResult.length}</Link></h4>
        </div>
        }
        {filterResult.length !=0 &&
        <div className="order-amount spaces">
          <h4><Link to={`/allOrders/${dateRange}/any`}>{result}</Link></h4>
        </div>
        }
        <div className="order-amount"><h4><Link to={`/logistics/${daysForLogis}`}>Logistic Stastics in last {daysForLogis} days.</Link> </h4></div>
        <div className="order-amount"><h4><Link to={`/longorders/${sevenDaysDate}`}>Order processing longer than 7 Days</Link></h4></div>
        <div className="order-amount"><h4><Link to="/fastThreeDays">The fastest 3 Days</Link></h4></div>
        <div className="order-amount"><h4><Link to="/slowestSevenDays">The slowest 7 Days</Link></h4></div>
        <div className="spaces"></div>


      </div>
    )
  }
}

// {filterResult.map(edge =>
//   <Order edge={edge} key={edge.node.id}/>
// )}
// class Order extends React.Component {
//   render() {
//     var order = this.props.edge.node;
//     return (
//         <div className="order">
//           <div className="order-detail">
//             <h4>{order.order_number}</h4>
//           </div>
//           <div className="order-detail">
//             <h4>{order.status}</h4>
//           </div>
//           <div className="order-detail">
//             <h4>{order.created_at}</h4>
//           </div>
//           <div className="order-detail">
//             <Link to={`/orders/${order.order_number}`}><h4>detail</h4></Link>
//           </div>
//         </div>
//     )
//   }
// }

export default Relay.createContainer(OrderList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders(first: 1000) {
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
