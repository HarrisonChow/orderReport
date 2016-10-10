import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import moment from 'moment';

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
        <div className="row">
          <div className="logistic-detail">
            <h4>NO.</h4>
          </div>
          <div className="logistic-detail">
            <h4>Name</h4>
          </div>
          <div className="logistic-detail">
            <h4>(0-2)days</h4>
          </div>
          <div className="logistic-detail">
            <h4>(3-5)days</h4>
          </div>
          <div className="logistic-detail">
            <h4>(5+)days</h4>
          </div>
        </div>
        {this.props.viewer.logistics.edges.map(edge =>
          <Logistic headerProp = {this.state.header} edge={edge} key={edge.node.id}/>
        )}
      </div>
    )
  }
}

class Logistic extends React.Component {
  render() {
    let edge = this.props.edge;
    let logisticId = (window.atob(edge.node.id)).match(/\d+/g);
    let filterData = edge.node.parcels.edges
                  .filter(edge => {
                    let daysRequired = parseInt(this.props.headerProp);
                    let createAt = moment(edge.node.created_at).format('L');
                    let startDate = moment().subtract(daysRequired, 'days').calendar();
                    return (moment(createAt).isAfter(startDate) && edge.node.status ==="Deliveried");
                  });
    let lessTwo = filterData.filter(edge=>{return edge.node.delivery_time <= 2});
    let ThreeToFive = filterData.filter(edge=>{return (edge.node.delivery_time > 2 && edge.node.delivery_time <= 5)});
    let fiveMore = filterData.filter(edge=>{return edge.node.delivery_time > 5});

    return (
        <div className="logistic">
          <div className="row">
            <div className="logistic-detail">
              <h4>{logisticId}</h4>
            </div>
            <div className="logistic-detail">
              <h4>{edge.node.name}</h4>
            </div>
            <div className="logistic-detail">
              <h4>{lessTwo.length}</h4>
            </div>
            <div className="logistic-detail">
              <h4>{ThreeToFive.length}</h4>
            </div>
            <div className="logistic-detail">
              <h4>{fiveMore.length}</h4>
            </div>
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
