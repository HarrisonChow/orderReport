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



export function getFastSLowByDays(speed, days) {
  return Order.findAll({where: {status: "Deliveried"}}).then(function(orders) {

    var oneDay = 24*60*60*1000;
    var doneByDays = [];
    var lastArray=[];
    var finalResult=[];

    for (var x = 0; x < orders.length; x++) {
      var diffDays = Math.round(Math.abs((new Date(orders[x].createdAt)).getTime() - (orders[x].updatedAt).getTime())/oneDay);
      if (diffDays < days ) {
        doneByDays.push(orders[x]);
      }
    }
    function fileterResultArray(arrays) {
      var defaultArray = [arrays[0]];
      var result =[];
      for (var i = 1; i < arrays.length; i++) {
        if (arrays[i].length > arrays[i-1].length) {
          defaultArray.push(arrays[i]);
        }
      }

      defaultArray.sort(function(a, b){
        if (speed === 'slowest') {
          return (a.length - b.length);
        } else {
          return (b.length - a.length);
        }

      });
      result = defaultArray[0];
      return result;
    }

    for (var j = 0; j < doneByDays.length; j++) {
      for (var m = j; m < doneByDays.length; m++) {
        if ((Math.round(Math.abs(((doneByDays[m].updatedAt).getTime() - (doneByDays[j].updatedAt).getTime())/(oneDay)))) < days ) {
          lastArray.push(doneByDays[m]);
        }
      }
      finalResult.push(lastArray);
      lastArray=[];
    }

    let checkResult = fileterResultArray(finalResult);
    return checkResult;
  });
}


 export function getAllOrders(order_number, created_at, status, fromDate, toDate) {
   var selectCondition = (order_number != 'any') ? {where: { orderNumber: order_number }} :
                         (created_at != 'any' && status === 'any') ? {where: { createdAt: {$gte: created_at} }} :
                         (created_at != 'any' && status != 'any') ? {where: { createdAt: {$gte: created_at}, status: status }} :
                         (fromDate != 'any' && toDate != 'any' && status === 'any') ? {where: { createdAt: {$gte: moment(fromDate).format(), $lte: moment(toDate).format()}}} :
                         (fromDate != 'any' && toDate != 'any' && status != 'any') ? {where: { createdAt: {$gte: moment(fromDate).format(), $lte: moment(toDate).format()},  status: status}} :
                         {order: '"id" ASC'};
   return Order.findAll( selectCondition );
 }

 export function getAmountByStatus(status = 'any') {
   var selectCondition = (status === "Processing") ? { where: {status: "Processing"} } :
                         (status === "Deliveried") ? { where: {status: "Deliveried"} } :
                         (status === "Delivery") ? { where: {status: "Delivery"} } :
                         undefined;
   return Order.findAndCountAll(selectCondition).then(function(result) {
     return result.count;
   });
 }

 export function getLogisticDeliveryTime(num, id) {
   var selectCondition = (num === 2) ? {$lte: num} : (num === 3) ? {$gte: num, $lte: 5} : {$gt: num};
   return Parcel.count({ where: {deliveryTime: selectCondition, logisticId: id}}).then(function(days) {
     return days;
   })
 }

 export function getAllParcels(tracking_number, created_at, delivery_time,logistic_name) {
   var selectCondition = (tracking_number != 'any') ? { where: { trackingNumber: tracking_number } } :
                         (created_at != 'any') ? { where: { createdAt: {$lt: created_at}, status: {$ne: "Deliveried"} } } :
                         (delivery_time === '2' && logistic_name != 'any') ? {where: {deliveryTime: {$lte: 2}},include: [{model: Logistic,where: {name: logistic_name}}]} :
                         (delivery_time === '3' && logistic_name != 'any') ? {where: {deliveryTime: {$gt: 2, $lte: 5}},include: [{model: Logistic,where: {name: logistic_name}}]} :
                         (delivery_time === '5' && logistic_name != 'any') ? {where: {deliveryTime: {$gt: 5}},include: [{model: Logistic,where: {name: logistic_name}}]} :
                         {order: '"id" ASC'};;
   return Parcel.findAll(selectCondition);
 }

 export function getFilterParcels(days, fromDate, toDate) {

   if (days != 'any') {
     return Parcel.findAll({where: { createdAt: {$gte: days}, status: "Deliveried" }});
   } else if (fromDate != 'any' && toDate != 'any') {
     return Parcel.findAll({where: { createdAt: {$gte: fromDate, $lte: toDate} , status: "Deliveried" }});
   } else {
     return Parcel.findAll();
   }
 }

 export function getAllLogistics() {
   return Logistic.findAll()
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
