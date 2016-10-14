import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import moment from 'moment';
import ReactChart from './ReactChart';

class LogisticsListByDays extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
         header: this.props.params.days,
      }
   }

  render() {

    return(
      <div className="container" >
        <h4>Logistics Statistic for last {this.props.params.days} days</h4>
        <svg width="650" height="30">
          <g>
            <rect x="20" y="0" height="10" width="10" fill='#00749F' />,
            <text x="40" y="10" fontSize="12" fill="black" > Less than 2 days </text>,
            <rect x="170" y="0" height="10" width="10" fill='#73C774' />,
            <text x="190" y="10" fontSize="12" fill="black" > 3 to 5 days </text>,
            <rect x="320" y="0" height="10" width="10" fill='#C7754C' />,
            <text x="340" y="10" fontSize="12" fill="black" > more than 5 days </text>,
          </g>
        </svg>
        {this.props.viewer.logistics.edges.map(edge =>
          <Logistic headerProp = {this.state.header} edge={edge} key={edge.node.id}/>
        )}
      </div>
    )
  }
}

class Logistic extends React.Component {
  render() {
    let logistic = this.props.edge.node;
    let logisticId = (window.atob(logistic.id)).match(/\d+/g);
    let filterData = logistic.parcels.edges
                  .filter(edge => {
                    let daysRequired = parseInt(this.props.headerProp);
                    let createAt = moment(logistic.created_at).format('L');
                    let startDate = moment().subtract(daysRequired, 'days').calendar();
                    return (moment(createAt).isAfter(startDate) && logistic.status ==="Deliveried");
                  });
    let lessTwo = filterData.filter(edge=>{return logistic.delivery_time <= 2});
    let ThreeToFive = filterData.filter(edge=>{return (logistic.delivery_time > 2 && logistic.delivery_time <= 5)});
    let fiveMore = filterData.filter(edge=>{return logistic.delivery_time > 5});

    let data = [
      {type: logistic.name, status: 'Less than 2 days', orderAmount: lessTwo.length, color: '#00749F'},
      {type: logistic.name, status: '3 to 5 days', orderAmount: ThreeToFive.length, color: '#73C774'},
      {type: logistic.name, status: 'more than 5 days', orderAmount: fiveMore.length, color: '#C7754C'},
      ]

    return (
        <div className="logistic">
          <div className="row">
            <div className={`logistic-${logistic.name}`}><ReactChart width={650} height={100} data={data} /></div>
          </div>
        </div>
    )
  }
}


export default Relay.createContainer(LogisticsListByDays, {

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        logistics(first: 99999) {
          edges {
            node {
              id,
              name,
              lessTwo,
              ThreeToFive,
              fiveMore,
              parcels(first: 999){
                edges{
                  node{
                    id,
                    delivery_time,
                    created_at,
                    status
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
