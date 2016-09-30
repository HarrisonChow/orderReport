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
import Order from './components/Order';
import OrderCheck from './components/OrderCheck';
import LongOrders from './components/LongOrders';
import Parcels from './components/Parcels';
import Parcel from './components/Parcel';
import Logistics from './components/Logistics';
import LogisticsByDays from './components/LogisticsByDays';
import useRelay from 'react-router-relay';
import {createHashHistory} from 'history';
import {applyRouterMiddleware, useRouterHistory} from 'react-router';

const history = useRouterHistory(createHashHistory)({ queryKey: false });
const mountNode = document.getElementById('root');

function prepareOrderParams(params, route) {
  return {
    ...params,
    order_number:params.id
  };
};

function prepareOrdersParams(params, route) {
  console.log(params);

  return {
    ...params,
  };
};

function prepareParcelParams(params, route) {
  return {
    ...params,
    tracking_number:params.id
  };
};



ReactDOM.render(
  <Router environment={Relay.Store} history={history} render={applyRouterMiddleware(useRelay)}>
    <Route path="/" component={TodoApp} queries={ViewerQueries}>
      <IndexRoute component={Orders} queries={ViewerQueries}/>
      <Route path="/orders/:id" component={Order} queries={ViewerQueries} prepareParams={prepareOrderParams}/>
      <Route path="/ordercheck/:status" component={Orders} queries={ViewerQueries}/>
      <Route path="/longorders" component={LongOrders} queries={ViewerQueries}/>
      <Route path="/parcels" component={Parcels} queries={ViewerQueries}/>
      <Route path="/parcels/:id" component={Parcel} queries={ViewerQueries} prepareParams={prepareParcelParams}/>
      <Route path="/logistics" component={Logistics} queries={ViewerQueries}/>
      <Route path="/logistics/:days" component={LogisticsByDays} queries={ViewerQueries}/>
    </Route>
  </Router>,
  mountNode
);
