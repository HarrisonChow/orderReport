import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import moment from 'moment';

class SpeedCheck extends React.Component {

  render() {
    var oneDay = 24*60*60*1000;
    var doneByDays=[];
    var checkdays;
    var pageTitle;
    var getParams = this.props.params.speed;
    if (getParams === 'fast') {
      checkdays = 3;
      pageTitle = "Fastest 3 days";
    } else {
      checkdays = 7;
      pageTitle = "Slowest 7 days";
    }

    let filterResult = this.props.viewer.orders.edges
                        .filter(edge => {
                          var createDate = new Date(edge.node.created_at);
                          var updateDate = new Date(edge.node.updated_at);
                          var diffDays = Math.round(Math.abs((createDate.getTime() - updateDate.getTime())/(oneDay)));
                          if (diffDays <= checkdays ) {
                            doneByDays.push([edge.node.order_number, updateDate]);
                          }
                        });

    var lastArray=[];
    var finalResult=[];
    for (var j = 0; j < doneByDays.length; j++) {
      for (var m = j; m < doneByDays.length; m++) {
        if ((Math.round(Math.abs((doneByDays[m][1].getTime() - doneByDays[j][1].getTime())/(oneDay)))) <= checkdays ) {
          lastArray.push([doneByDays[m][0], doneByDays[m][1]]);
        }
      }
      finalResult.push(lastArray);
      lastArray=[];
    }
    console.log(finalResult.length);

    function fileterResultArray(arrays) {
      var defaultArray = [arrays[0]];
      var result =[];
      for (var i = 1; i < arrays.length; i++) {
        if (arrays[i].length>arrays[i-1].length) {
          defaultArray.push(arrays[i]);
        }
      }
      if (getParams === 'slowest') {
        defaultArray.sort(function(a, b){
          return a.length - b.length;
        });
      } else {
        defaultArray.sort(function(a, b){
          return b.length - a.length;
        });
      }
      result = [defaultArray[0]];
      return result;
    }

    let checkResult = fileterResultArray(finalResult);
    console.log(checkResult[0].length);


    var total = checkResult[0].length;
    var contents = [];
    var dateArray = [];
    for (var i = 0; i < checkResult[0].length; i++) {
      var orderDate = moment(new Date(checkResult[0][i][1].getTime()).toString("MMM dd")).format('L');
      contents.push(
        <div className="order" key={i}>
          <div className="order-detail">
            <h4>{checkResult[0][i][0]}</h4>
          </div>
          <div className="order-detail">
            <h4>{orderDate}</h4>
          </div>
          <div className="order-detail">
            <Link to={`/orders/${checkResult[0][i][0]}`}><h4>detail</h4></Link>
          </div>
        </div>
      );
      dateArray.push(checkResult[0][i][1]);
    }

    var maxDate = new Date(Math.max.apply(null,dateArray));
    var minDate = new Date(Math.min.apply(null,dateArray));
    var fromDate = moment(minDate).format('L');
    var toDate = moment(maxDate).format('L');

    return(
      <div className="container" >
        <h3>{pageTitle}</h3>
        <h4>From {fromDate} To {toDate} , {total} orders done.</h4>
        {contents}
      </div>
    )
  }
}

export default Relay.createContainer(SpeedCheck, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        orders(first: 8888) {
          edges {
            node {
              id,
              order_number,
              created_at,
              updated_at,
              status
            }
          }
        }
      }
    `
  },
});
