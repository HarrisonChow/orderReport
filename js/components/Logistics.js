import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import ReactChart from './ReactChart';


class LogisticList extends React.Component {
  render() {
    return(
      <div className="container" >
        <h4>Logistics Statistic</h4>
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
          <Logistic edge={edge} key={edge.node.id}/>
        )}

      </div>
    )
  }
}

class Logistic extends React.Component {
  render() {
    var logistic = this.props.edge.node;

    let data = [
      {type: logistic.name, status: 'Less than 2 days', orderAmount: logistic.lessTwo, color: '#00749F'},
      {type: logistic.name, status: '3 to 5 days', orderAmount: logistic.ThreeToFive, color: '#73C774'},
      {type: logistic.name, status: 'more than 5 days', orderAmount: logistic.fiveMore, color: '#C7754C'},
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


export default Relay.createContainer(LogisticList, {
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
                    created_at
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
