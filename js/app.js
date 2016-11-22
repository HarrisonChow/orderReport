import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {IndexRoute, Route, Router} from 'react-router';
import OrderReportApp from './components/OrderReportApp';
import ViewerQueries from './queries/ViewerQueries';
import OrderList from './components/Orders';
import AllOrders from './components/AllOrders';
import Order from './components/Order';
import SpeedByDays from './components/FastAndSlow';
import Parcels from './components/Parcels';
import Parcel from './components/Parcel';
import LogisticsList from './components/Logistics';
import useRelay from 'react-router-relay';
import {createHashHistory} from 'history';
import {applyRouterMiddleware, useRouterHistory} from 'react-router';
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const history = useRouterHistory(createHashHistory)({ queryKey: false });
const mountNode = document.getElementById('root');

function prepareOrderParams(params, route) {
  return {
    ...params,
    invoiceNumber:params.id
  };
};

function prepareOrderdateParams(params, route) {
  let selectDaysDates = moment().subtract(params.days, 'days').calendar();
  let selectDaysDate = moment(selectDaysDates).format();
  return {
    ...params,
    invoiceDate:selectDaysDate,
    status:params.status
  };
};

function prepareOrderRangeParams(params, route) {
  return {
    ...params,
    fromDate:params.from,
    toDate:params.to,
    status:params.status
  };
};

function prepareOrderRangeHomeParams(params, route) {
  let selectDaysDate = moment(params.from).format();
  return {
    ...params,
    fromDate:params.from,
    toDate:params.to,
  };
};

function prepareOrderFastandSlowParams(params, route) {
  return {
    ...params,
    fromDate:params.from,
    toDate:params.to,
    speed:params.speed,
  };
};


function prepareParceldateParams(params, route) {
  let sevenDaysDates = moment().subtract(params.createdAt, 'days').calendar();
  let sevenDaysDate = moment(sevenDaysDates).format();
  return {
    ...params,
    createdAt:sevenDaysDate
  };
};

function prepareParcelbyLogisticdateParams(params, route) {
  return {
    ...params,
    logisticId: params.logistic,
    deliveryTime: params.days
  };
};

function prepareLogsticsStatisticParams(params, route) {
  let getDates = moment().subtract(params.days, 'days').calendar();
  let getDate = moment(getDates).format();
  return {
    ...params,
    days:getDate,
  };
};

function prepareIndexParams(params, route) {
  let getToDates = new Date();
  let getFromDates = new Date( ( moment( moment().subtract( 7, 'days' ).calendar() ).utc() ).format() );
  let getToDate = getToDates.toString();
  let getFromDate = getFromDates.toString();
  return {
    ...params,
    invoiceNumber: 'any',
    createdAt: 'any',
    status: null,
    toDate: getToDate,
    fromDate: getFromDate
  };
};

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <Router environment={Relay.Store} history={history} render={applyRouterMiddleware(useRelay)} forceFetch={true}>
      <Route path="/" component={OrderReportApp} >
        <IndexRoute component={OrderList} queries={ViewerQueries} prepareParams={prepareIndexParams}/>
        <Route path="/orders/:id" component={Order} queries={ViewerQueries} prepareParams={prepareOrderParams}/>
        <Route path="/orders/:from/:to" component={OrderList} queries={ViewerQueries} prepareParams={prepareOrderRangeHomeParams}/>
        <Route path="/allOrders" component={AllOrders} queries={ViewerQueries} prepareParams={params => ({ ...params, days: 'any', status: null,  fromDate: 'any', toDate: 'any'  })}/>
        <Route path="/allOrders/:days/:status" component={AllOrders} queries={ViewerQueries} prepareParams={prepareOrderdateParams}/>
        <Route path="/OrdersByRange/:status/:from/:to" component={AllOrders} queries={ViewerQueries} prepareParams={prepareOrderRangeParams}/>
        <Route path="/OrdersByRange/:from/:to" component={AllOrders} queries={ViewerQueries} prepareParams={prepareOrderRangeHomeParams}/>
        <Route path="/longorders/:createdAt" component={Parcels} queries={ViewerQueries} prepareParams={prepareParceldateParams}/>
        <Route path="/parcels" component={Parcels} queries={ViewerQueries} prepareParams={params => ({ ...params, logisticId: 'any', deliveryTime: 'any'})}/>
        <Route path="/parcels/:days/:logistic" component={Parcels} queries={ViewerQueries} prepareParams={prepareParcelbyLogisticdateParams}/>
        <Route path="/parcels/:id" component={Parcel} queries={ViewerQueries} prepareParams={params => ({...params, trackingNumber: params.id})}/>
        <Route path="/logistics" component={LogisticsList} queries={ViewerQueries} />
        <Route path="/logistics/:days" component={LogisticsList} queries={ViewerQueries} prepareParams={prepareLogsticsStatisticParams}/>
        <Route path="/logistics/:from/:to" component={LogisticsList} queries={ViewerQueries} prepareParams={prepareOrderRangeHomeParams}/>
        <Route path="/speedcheck/:speed/:from/:to" component={SpeedByDays} queries={ViewerQueries} prepareParams={prepareOrderFastandSlowParams}/>
      </Route>
    </Router>
  </MuiThemeProvider>,
  mountNode
);
