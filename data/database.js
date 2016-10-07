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


 import Sequelize from 'sequelize';
 import moment from 'moment';

 import {
   connectionFromPromisedArray,
 } from 'graphql-relay';

 export const Conn = new Sequelize(
   'orders_report',
   'albert',
   'sydneytools123',
   {
     dialect: 'postgres',
     host: 'localhost'
   }
 );

 export const Order = Conn.define('order', {
   orderNumber: {
     type: Sequelize.STRING
   },
   status: {
     type: Sequelize.STRING
   },
   createdAt: {
     type: Sequelize.STRING
   },
   updatedAt: {
     type: Sequelize.DATE
   }
 });

 export const Parcel = Conn.define('parcel', {
   trackingNumber: {
     type: Sequelize.STRING
   },
   status: {
     type: Sequelize.STRING
   },
   deliveryTime: {
     type: Sequelize.INTEGER
   },
   orderId: {
     type: Sequelize.INTEGER
   },
   logisticId: {
     type: Sequelize.INTEGER
   },
 });

 export const Logistic = Conn.define('logistic', {
   name: {
     type: Sequelize.STRING
   }
 });

 //relationships
 Order.hasMany(Parcel);
 Parcel.belongsTo(Order);
 Logistic.hasMany(Parcel);
 Parcel.belongsTo(Logistic);



 export function getOrder(id) {
   const order = Order.findOne({
     where:{id: id},
   }).then(function(v) {
     return order;
   });
 };
 export function getParcel(id) {
   const parcel = Parcel.findOne({
     where:{id: id},
   }).then(function(v) {
     return parcel;
   });
 };
 export function getLogistic(id) {
   const logistic = Logistic.findOne({
     where:{id: id},
   }).then(function(v) {
     return logistic;
   });
 };

 export function getAllOrders(order_number, created_at, status) {
   if( order_number != 'any') {
     return Order.findAll({ where: { orderNumber: order_number } });
   } else if (created_at != 'any' && status === 'any') {
     return Order.findAll({ where: { createdAt: {$gt: created_at} } });
   } else if (created_at != 'any' && status != 'any') {
     return Order.findAll({ where: { createdAt: {$gt: created_at}, status: status }});
   } else {
     return Order.findAll({order: '"createdAt" DESC'});
   }
 }


 export function getAmountByStatus(status = 'any') {
   if (status === 'any') {
     return Order.findAndCountAll().then(function(result) {
      return result.count;
    });
   } else if (status === "Processing") {
    return Order.findAndCountAll({ where: {status: "Processing"} }).then(function(result) {
     return result.count;
     });
   } else if (status === "Deliveried") {
     return Order.findAndCountAll({ where: {status: "Deliveried"} }).then(function(result) {
      return result.count;
    });
  } else if (status === "Delivery") {
    return Order.findAndCountAll({ where: {status: "Delivery"} }).then(function(result) {
     return result.count;
   });
   }
 }


 export function getLogisticDeliveryTime(num, id, days) {
   if (num === 2) {
     return Parcel.count({ where: {deliveryTime: {$lte: num}, logisticId: id}}).then(function(days) {
       return days;
     });
   } else if (num === 3) {
     return Parcel.count({ where: {deliveryTime: {$gte: num, $lte: 5}, logisticId: id} }).then(function(days) {
       return days;
     });
   } else {
     return Parcel.count({ where: {deliveryTime: {$gt: num}, logisticId: id} }).then(function(days) {
       return days;
     });
   }
 }

 export function getAllParcels(tracking_number, created_at) {
   if (tracking_number === 'any' && created_at === 'any') {
     return Parcel.findAll();
   } else if(created_at === 'any') {
     return Parcel.findAll({ where: { trackingNumber: tracking_number } });
   } else if (tracking_number === 'any') {
     return Parcel.findAll({ where: { createdAt: {$lt: created_at}, status: {$ne: "Deliveried"} } });
   }
 }


 export function getAllLogistics() {
  return Logistic.findAll();
 }

export class Todo {}
export class User {}

// Mock authenticated ID
const VIEWER_ID = 'me';

// Mock user data
const viewer = new User();
viewer.id = VIEWER_ID;
const usersById = {
  [VIEWER_ID]: viewer,
};

// Mock todo data
const todosById = {};
const todoIdsByUser = {
  [VIEWER_ID]: [],
};
let nextTodoId = 0;
addTodo('Taste JavaScript', true);
addTodo('Buy a unicorn', false);

export function addTodo(text, complete) {
  const todo = new Todo();
  todo.complete = !!complete;
  todo.id = `${nextTodoId++}`;
  todo.text = text;
  todosById[todo.id] = todo;
  todoIdsByUser[VIEWER_ID].push(todo.id);
  return todo.id;
}

export function changeTodoStatus(id, complete) {
  const todo = getTodo(id);
  todo.complete = complete;
}

export function getTodo(id) {
  return todosById[id];
}

export function getTodos(status = 'any') {
  const todos = todoIdsByUser[VIEWER_ID].map(id => todosById[id]);
  if (status === 'any') {
    return todos;
  }
  return todos.filter(todo => todo.complete === (status === 'completed'));
}

export function getUser(id) {
  return usersById[id];
}

export function getViewer() {
  return getUser(VIEWER_ID);
}

export function markAllTodos(complete) {
  const changedTodos = [];
  getTodos().forEach(todo => {
    if (todo.complete !== complete) {
      todo.complete = complete;
      changedTodos.push(todo);
    }
  });
  return changedTodos.map(todo => todo.id);
}

export function removeTodo(id) {
  const todoIndex = todoIdsByUser[VIEWER_ID].indexOf(id);
  if (todoIndex !== -1) {
    todoIdsByUser[VIEWER_ID].splice(todoIndex, 1);
  }
  delete todosById[id];
}

export function removeCompletedTodos() {
  const todosToRemove = getTodos().filter(todo => todo.complete);
  todosToRemove.forEach(todo => removeTodo(todo.id));
  return todosToRemove.map(todo => todo.id);
}

export function renameTodo(id, text) {
  const todo = getTodo(id);
  todo.text = text;
}
