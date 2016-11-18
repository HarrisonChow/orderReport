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
          <div className = "pagelayout">
            <div className="logisticTitle"><h4> {title} </h4></div>
            {this.props.viewer.logistics.edges.map(edge =>
              <Logistic edge={edge} name={edge.node.name} days={this.props.days} titleDays={this.props.params.days} fromDate={this.props.fromDate} toDate={this.props.toDate} key={edge.node.id} />
            )}
          </div>
        <FooterNavigation/>
      </div>
    )
  }
}

class Logistic extends React.Component {

  render() {
    var logistic = this.props.edge.node;

    let filterData = logistic.filterparcels.edges;
    function filterCondition(days,name) {
      return filterData.filter(edge=>{
        let checkDays = (new Date(edge.node.delivery_time).getTime()- new Date(edge.node.order.invoice_date).getTime())/(1000*60*60*24);
        let filterCons = (days===2)? checkDays<=2 : (days===3)? (checkDays>=3 && checkDays<=5) : checkDays>5;
        return (edge.node.delivery_time && filterCons && edge.node.logistic.name ===name)});
    }
    let lessTwo =filterCondition(2, this.props.name);
    let ThreeToFive =filterCondition(3, this.props.name);
    let fiveMore =filterCondition(5, this.props.name);

    let amountOfLessThree = (this.props.days || this.props.fromDate) ? lessTwo.length : logistic.lessTwo;
    let amountOfThreeToFive = (this.props.days || this.props.fromDate) ? ThreeToFive.length : logistic.ThreeToFive;
    let amountOfFiveMore = (this.props.days || this.props.fromDate) ? fiveMore.length : logistic.fiveMore;
    function getIndex(id) {
      return window.atob(id).match(/\d+$/)[0];
    }
    let data = [
      {type: logistic.name, logisticId: getIndex(logistic.id), status: 'Less than 2 days', orderAmount: amountOfLessThree, color: '#00749F'},
      {type: logistic.name, logisticId: getIndex(logistic.id), status: '3 to 5 days', orderAmount: amountOfThreeToFive, color: '#73C774'},
      {type: logistic.name, logisticId: getIndex(logistic.id), status: 'more than 5 days', orderAmount: amountOfFiveMore, color: '#C7754C'},
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
                    order{
                      invoice_date
                    }
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
