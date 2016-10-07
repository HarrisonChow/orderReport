import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';

class LogisticList extends React.Component {
  render() {
    return(
      <div className="container" >
        <h4>Logistics Statistic</h4>
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
          <Logistic edge={edge} key={edge.node.id}/>
        )}
      </div>
    )
  }
}

class Logistic extends React.Component {
  render() {
    var edge = this.props.edge;
    let logisticId = (window.atob(edge.node.id)).match(/\d+/g);

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
              <h4>{edge.node.lessTwo}</h4>
            </div>
            <div className="logistic-detail">
              <h4>{edge.node.ThreeToFive}</h4>
            </div>
            <div className="logistic-detail">
              <h4>{edge.node.fiveMore}</h4>
            </div>
          </div>
        </div>
    )
  }
}
//
// class Parcel extends React.Component {
//   render() {
//     var edge = this.props.edge;
//     return (
//       <div>
//         <div><h4>Parcel Delivery Time: {edge.node.delivery_time}</h4></div>
//         <div className="logistic-detail">
//           <h4></h4>
//         </div>
//       </div>
//
//     )
//   }
// }

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
