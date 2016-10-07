/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {IndexRoute, Route, Router} from 'react-router';
import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import ViewerQueries from './queries/ViewerQueries';
import Orders from './components/Orders';
import AllOrders from './components/AllOrders';
import Order from './components/Order';
import SpeedCheck from './components/SpeedCheck';
import LongOrders from './components/LongOrders';
import Parcels from './components/Parcels';
import Parcel from './components/Parcel';
import Logistics from './components/Logistics';
import LogisticsByDays from './components/LogisticsByDays';
import useRelay from 'react-router-relay';
import {createHashHistory} from 'history';
import {applyRouterMiddleware, useRouterHistory} from 'react-router';
import moment from 'moment';

const history = useRouterHistory(createHashHistory)({ queryKey: false });
const mountNode = document.getElementById('root');

function prepareOrderParams(params, route) {
  return {
    ...params,
    order_number:params.id
  };
};

function prepareOrdersParams(params, route) {
  return {
    ...params,
  };
};
function prepareOrderdateParams(params, route) {
  let selectDaysDate = moment().subtract(params.days, 'days').calendar();
  return {
    ...params,
    created_at:selectDaysDate,
    status:params.status
  };
};

function prepareParcelParams(params, route) {
  return {
    ...params,
    tracking_number:params.id
  };
};
function prepareParcelPageParams(params, route) {
  return {
    ...params,
    cursor:params.cursor
  };
};
function prepareParceldateParams(params, route) {
  let sevenDaysDate = moment().subtract(params.created_at, 'days').calendar();
  return {
    ...params,
    created_at:sevenDaysDate
  };
};


ReactDOM.render(
  <Router environment={Relay.Store} history={history} render={applyRouterMiddleware(useRelay)}>
    <Route path="/" component={TodoApp} queries={ViewerQueries}>
      <IndexRoute component={Orders} queries={ViewerQueries}/>
      <Route path="/orders/:id" component={Order} queries={ViewerQueries} prepareParams={prepareOrderParams}/>
      <Route path="/speedcheck/:speed" component={SpeedCheck} queries={ViewerQueries}/>
      <Route path="/allOrders" component={AllOrders} queries={ViewerQueries}/>
      <Route path="/allOrders/:days/:status" component={AllOrders} queries={ViewerQueries} prepareParams={prepareOrderdateParams}/>
      <Route path="/longorders/:created_at" component={LongOrders} queries={ViewerQueries} prepareParams={prepareParceldateParams}/>
      <Route path="/parcels" component={Parcels} queries={ViewerQueries}/>
      <Route path="/parcels/:id" component={Parcel} queries={ViewerQueries} prepareParams={prepareParcelParams}/>
      <Route path="/logistics" component={Logistics} queries={ViewerQueries}/>
      <Route path="/logistics/:days" component={LogisticsByDays} queries={ViewerQueries}/>
    </Route>
  </Router>,
  mountNode
);
