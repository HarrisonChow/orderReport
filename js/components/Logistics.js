import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {IndexLink, Link} from 'react-router';
import ReactChart from './ReactChart';
import Paper from 'material-ui/Paper';
import FooterNavigation from './Footer';
import NavbarInstance from './Navigationbar';

const style = {
  bottomPaper: {
    textAlign: 'center',
    margin:20,
  },
  emptyPaper:{
    textAlign: 'left',
    height: '15vh',
    margin:20,
    fontSize:18,
    paddingTop:'6vh',
    paddingLeft: 25,
    color: '#DB7093'
  }
};

class LogisticsList extends React.Component {
  render() {
    let title = (this.props.params.days) ? 'Logistics Statistic for last ' + this.props.params.days + ' days' :
                (this.props.params.from) ? 'Logistics Statistic from ' + this.props.params.from + ' to ' + this.props.params.to:
                'Logistics Statistic';
    return(
      <div>
        <NavbarInstance />
          <div className="logistic"><h4> {title} </h4></div>
          {this.props.viewer.logistics.edges.map(edge =>
            <Logistic edge={edge} name={edge.node.name} days={this.props.days} titleDays={this.props.params.days} fromDate={this.props.fromDate} toDate={this.props.toDate} key={edge.node.id} />
          )}
        <FooterNavigation click = {this.state}/>
      </div>
    )
  }
}

class Logistic extends React.Component {

  render() {
    var logistic = this.props.edge.node;
    let filterData = logistic.filterparcels.edges;
    let lessTwo = filterData.filter(edge=>{return (edge.node.delivery_time && edge.node.delivery_time <= 2 && edge.node.logistic.name ===this.props.name)});
    let ThreeToFive = filterData.filter(edge=>{return (edge.node.delivery_time && edge.node.delivery_time > 2 && edge.node.delivery_time <= 5 && edge.node.logistic.name ===this.props.name)});
    let fiveMore = filterData.filter(edge=>{return (edge.node.delivery_time && edge.node.delivery_time > 5 && edge.node.logistic.name ===this.props.name)});
    let x = (this.props.days || this.props.fromDate) ? lessTwo.length : logistic.lessTwo;
    let y = (this.props.days || this.props.fromDate) ? ThreeToFive.length : logistic.ThreeToFive;
    let z = (this.props.days || this.props.fromDate) ? fiveMore.length : logistic.fiveMore;
    let data = [
      {type: logistic.name, status: 'Less than 2 days', orderAmount: x, color: '#00749F'},
      {type: logistic.name, status: '3 to 5 days', orderAmount: y, color: '#73C774'},
      {type: logistic.name, status: 'more than 5 days', orderAmount: z, color: '#C7754C'},
      ]
    if (data[0].orderAmount ===0 && data[1].orderAmount ===0 && data[2].orderAmount ===0) {
      return (
        <div className="logistic">
          <Paper zDepth={1} style={style.emptyPaper}>
            <div className={`logistic-${logistic.name}`}>{`${logistic.name}`} has no delivery in past {`${this.props.titleDays}`} days</div>
          </Paper>
        </div>
      )
    } else {
      return (
          <div className="logistic">
            <Paper zDepth={1} style={style.bottomPaper}>
              <div className={`logistic-${logistic.name}`}><ReactChart width={650} height={120} data={data} /></div>
            </Paper>
          </div>
      )
    }
  }
}

export default Relay.createContainer(LogisticsList, {
  initialVariables: {
    days: null,
    fromDate: null,
    toDate: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {

        logistics(first: 99999) {
          edges {
            cursor,
            node {
              id,
              name,
              lessTwo,
              ThreeToFive,
              fiveMore,
              filterparcels(days: $days, fromDate: $fromDate,toDate: $toDate, first: 999){
                edges{
                  node{
                    id,
                    delivery_time,
                    created_at,
                    status,
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
