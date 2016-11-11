 import Sequelize from 'sequelize';
 import moment from 'moment';

 import {
   connectionFromPromisedArray,
 } from 'graphql-relay';

 export const Conn = new Sequelize(
   'orders_report',
   'postgres',
   'postgres',
   {
     dialect: 'postgres',
     host: 'localhost'
   }
 );

 export const Order = Conn.define('order',
    {
        invoice_number: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        invoice_date: {
            type: Sequelize.DATE
        },
        billing_firstname: {
            type: Sequelize.STRING
        },
        billing_lastname: {
            type: Sequelize.STRING
        },
        billing_email: {
            type: Sequelize.STRING
        },
        billing_phone: {
            type: Sequelize.STRING
        },
        billing_street: {
            type: Sequelize.STRING
        },
        billing_suburb: {
            type: Sequelize.STRING
        },
        billing_postcode: {
            type: Sequelize.STRING
        },
        billing_state: {
            type: Sequelize.STRING
        },
        grand_total: {
            type: Sequelize.INTEGER
        },
        shipping_amount: {
            type: Sequelize.INTEGER
        },
        created_at: {
            type: Sequelize.DATE
        },
        updated_at: {
            type: Sequelize.DATE
        }
    },
    {
        underscored: true,
    }
);

 export const Item = Conn.define('order_item',
    {
        invoice_number: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        model: {
            type: Sequelize.STRING
        },
        aden_code: {
            type: Sequelize.STRING
        },
        qty: {
            type: Sequelize.INTEGER
        },
        unit_price: {
            type: Sequelize.INTEGER
        },
        subtotal: {
            type: Sequelize.INTEGER
        },
        created_at: {
            type: Sequelize.DATE
        },
        updated_at: {
            type: Sequelize.DATE
        }
    },
    {
      underscored: true,
    }
);

export const Parcel = Conn.define('parcel',
    {
        tracking_number: {
            type: Sequelize.STRING
        },
        invoice_number: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        delivery_time: {
            type: Sequelize.DATE
        },
        weight: {
            type: Sequelize.INTEGER
        },
        width: {
            type: Sequelize.INTEGER
        },
        length: {
            type: Sequelize.INTEGER
        },
        height: {
            type: Sequelize.INTEGER
        },
        packed_by: {
            type: Sequelize.STRING
        },
        shipping_firstname: {
            type: Sequelize.STRING
        },
        shipping_lastname: {
            type: Sequelize.STRING
        },
        shipping_email: {
            type: Sequelize.STRING
        },
        shipping_phone: {
            type: Sequelize.STRING
        },
        shipping_street: {
            type: Sequelize.STRING
        },
        shipping_suburb: {
            type: Sequelize.STRING
        },
        shipping_postcode: {
            type: Sequelize.STRING
        },
        shipping_state: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.DATE
        },
        updated_at: {
            type: Sequelize.DATE
        }
        },
    {
        underscored: true,
    }
);

export const Logistic = Conn.define('logistic',
    {
        name: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.DATE
        },
        updated_at: {
            type: Sequelize.DATE
        }
    },
    {
        underscored: true,
    }
);


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

export function getFastSLowByDays(speed, daterange) {
    let getDates = moment().subtract(daterange, 'days').calendar();
    let getDate = moment(getDates).format('YYYY-MM-DD');
    var condition = (speed === 'fastest') ? "MIN" : "MAX";

    return  Order.sequelize.query(
    "SELECT * FROM orders RIGHT JOIN parcels ON orders.id = parcels.order_id WHERE (DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) = (SELECT " + condition + "(DATE_PART('day', filterResults.delivery_time::timestamp - filterResults.invoice_date::timestamp)) FROM (SELECT * FROM orders RIGHT JOIN parcels ON orders.id = parcels.order_id WHERE orders.invoice_date >='"+ getDate +"') AS filterResults)) ",
    { type: Sequelize.QueryTypes.SELECT}).then(function(orders)
        {
            return orders;
        })
}

export function getFast(speed, fromDate, toDate) {
    var condition = (speed === 'fastest') ? "MIN" : "MAX";
    var newFromDate = moment(fromDate).format('YYYY-MM-DD');

    return  Order.sequelize.query(
      "SELECT " + condition + "(DATE_PART('day', filterResults.delivery_time::timestamp - filterResults.invoice_date::timestamp)) FROM (SELECT * FROM orders RIGHT JOIN parcels ON orders.id = parcels.order_id WHERE orders.invoice_date >='"+ newFromDate +"') AS filterResults",
      { type: Sequelize.QueryTypes.SELECT}).then(function(orders)
          {
              var returnResult =
                  (speed === 'fastest')?
                  ((orders[0].min)? orders[0].min:0) :
                  ((orders[0].max)? orders[0].max:0) ;
              return returnResult;
          })
}

export function getAllOrders(invoiceNumber, invoiceDate, status, fromDate, toDate) {
    var selectCondition =
        (invoiceNumber != 'any') ?
            {where: { invoice_number: invoiceNumber }} :
        (invoiceDate != 'any' && status === 'any') ?
            {where: { invoice_date: {$gt: invoiceDate} }} :
        (invoiceDate != 'any' && status != 'any') ?
            {where: { invoice_date: {$gt: invoiceDate}, status: status }} :
        (fromDate != 'any' && toDate != 'any' && status === 'any') ?
            {where: { invoice_date: {$gt: moment(fromDate).format('YYYY-MM-DD'), $lt: moment(toDate).format('YYYY-MM-DD')}}} :
        (fromDate != 'any' && toDate != 'any' && status != 'any') ?
            {where: { invoice_date: {$gt: moment(fromDate).format('YYYY-MM-DD'), $lt: moment(toDate).format('YYYY-MM-DD')},  status: status}} :
        {order: '"id" ASC'};
    return Order.findAll( selectCondition );
    }

export function getAmountByStatus(status) {
    var selectCondition =
        (status === 1) ? { where: {status: 1} } :
        (status === 2) ? { where: {status: 2} } :
        (status === 3) ? { where: {status: 3} } :
        undefined;
    return Order.findAndCountAll(selectCondition).then(function(result)
        {
            return result.count;
        });
}

export function getLogisticDeliveryTime(num, id){
    var selectCondition =
        (num === 2) ?
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) <=2" :
        (num === 3) ?
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) <= 5 AND DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) >= 3" :
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) >5";

    return Parcel.sequelize.query("SELECT * FROM parcels RIGHT JOIN orders ON orders.id = parcels.order_id WHERE parcels.logistic_id=" + id + " AND " + selectCondition , {type: Sequelize.QueryTypes.SELECT}).then(function(parcels)
        {
            return parcels.length;
        })
}

export function getAllParcels(tracking_number, created_at, delivery_time,logistic_id) {
    var selectConditionTwo =
        (delivery_time === '2') ?
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) <=2" :
        (delivery_time === '3') ?
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) <= 5 AND DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) >= 3" :
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) >5";

    var selectConditionOne =
        (tracking_number != 'any') ? { where: { tracking_number: tracking_number } } :
        (created_at != 'any') ? { where: { created_at: {$lt: created_at}, status: {$ne: 3} } } :
        {order: '"id" ASC'};

    if (delivery_time != 'any' && logistic_id != 'any') {
        return Parcel.sequelize.query("SELECT * FROM parcels RIGHT JOIN orders ON orders.id = parcels.order_id WHERE parcels.logistic_id=" + logistic_id+" AND " + selectConditionTwo , {type: Sequelize.QueryTypes.SELECT}).then(function(parcelsResult)
            {
                return parcelsResult;
            })
    } else {
        return Parcel.findAll(selectConditionOne)
    }
}

export function getFilterParcels(days, fromDate, toDate) {

    if (days != 'any') {
        return Parcel.findAll({where: {status: 3 }, include:[{model: Order, where: {invoice_date: {$gte: days}}}]});
    } else if (fromDate != 'any' && toDate != 'any') {
        return Parcel.findAll({where: {status: 3 }, include:[{model: Order, where: {invoice_date: {$gte: fromDate, $lte: toDate}}}]});
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
Conn.sync({force: false});
