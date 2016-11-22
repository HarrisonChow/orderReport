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
        dispatch_time: {
            type: Sequelize.DATE
        },
        packing_time: {
            type: Sequelize.DATE
        },
        created_datetime: {
            type: Sequelize.DATE
        },
        carrier: {
          type: Sequelize.STRING
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


var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var csv = require("fast-csv");
var http = require('http');


// create backup files and save to 'data/'
function backupCsv(files) {
  let filesCondition = (files === 'orders')? "data/OrderCsvBak/ordersCsvBak" : "data/ParcelCsvBak/parcelsCsvBak";
  // backup files name format
  function myDateSTring(){
    var timeInMs = new Date();
    var dateTime = moment(timeInMs).format("YYYY-MM-DD HH:mm:ss");
    return dateTime;
  }
  csv
    .fromPath("data/"+files+".csv")
    .pipe(csv.createWriteStream())
    .pipe(fs.createWriteStream(filesCondition+myDateSTring()+".csv", {encoding: "utf8"}));
}


//delete backup files if the file modified date is longer than 15 days
function deleteCsv(files) {
  let deleteCondition = (files === 'orders')? "data/OrderCsvBak/" : "data/ParcelCsvBak/";
  var allFile = fs.readdirSync(deleteCondition);
  for (var i = 0; i < allFile.length; i++) {
    try {
      var stats = fs.statSync(deleteCondition+allFile[i]).mtime.getTime();
      var today = new Date().getTime();
      var setDeleteTime = (today - stats)/(1000*60*60*24);
      if (setDeleteTime >= 15) {
        fs.unlinkSync(deleteCondition+allFile[i]);
      }
    }
    catch(err) {
        console.log('it does not exist');
    }
  }
}
deleteCsv('orders');
deleteCsv('parcels');


var ordersInputFile='data/orders.csv';
var parcelsInputFile='data/parcels.csv';

// Check if the csv file have data already saved or not
function checkDuplicateData(tables,value) {
  return tables.count({ where: { invoice_number: value } })
    .then(count => {
      if (count != 0) {
        return false;
      }
      return true;
  });
}

// read orders.csv and save to database then read parcels.csv and save to database as well.

//create order table with orders.csv file
var ordersParser = parse({delimiter: ','}, function (err, data) {
    async.eachSeries(data, function (line, callback) {

        var orderField = ['invoice_number', 'invoice_date', 'billing_firstname', 'billing_lastname', 'billing_email', 'billing_phone', 'billing_street', 'billing_suburb', 'billing_postcode', 'billing_state', 'grand_total', 'shipping_amount'];
        var orderTable = orderField.reduce(function(allContent, index, key){
            allContent[index] = line[key+1];
            return allContent
        },{});

        checkDuplicateData(Order, line[1]).then(notExist => {
            if (notExist) {
                return Order.create(
                orderTable
                ).then(function() {
                callback();
                });
            } else {
                callback();
            }
        });

    }, function done() {
      // delete orders.csv file
        fs.unlinkSync(ordersInputFile);
      // start to read parcels.csv file and create parcel table
        if (fs.existsSync(parcelsInputFile)) {
            fs.createReadStream(parcelsInputFile).pipe(parcelsParser);
            //back up parcels.csv file to ParcelCsvBak folder
            backupCsv('parcels');
        }
    })
})


// create parcel table with parcels.csv file
var parcelsParser = parse({delimiter: ','}, function (err, data) {
    async.eachSeries(data, function (line, callback) {

        let logisticID = (line[4]==='TNT') ? 1 : (line[4]==='TOLL') ? 2 : 3;

        checkDuplicateData(Parcel, line[1]).then(notExist => {
            if (notExist) {
                Order.find({where: {invoice_number:line[1]}}).then(function (idd) {
                    let orderID = JSON.stringify(idd.id);
                    var parcelField = ['invoice_number', 'tracking_number', 'created_datetime', 'carrier', 'weight', 'width', 'length', 'height', 'packed_by', 'shipping_firstname', 'shipping_lastname', 'shipping_email', 'shipping_phone', 'shipping_street', 'shipping_suburb', 'shipping_postcode', 'shipping_state'];
                    var parcelTable = parcelField.reduce(function(allContent, index, key, arr){
                        allContent[index] = line[key+1];
                        return allContent
                    },{});
                    parcelTable.logistic_id = logisticID;
                    parcelTable.order_id = orderID;
                    return Parcel.create(
                        parcelTable
                    );
                }).then(function() {
                    callback();
                });
            } else {
                callback();
            }
        })
    }, function done() {
      // delete the parcels.csv file
        fs.unlinkSync(parcelsInputFile);
    })
})

if(fs.existsSync(ordersInputFile)){
    fs.createReadStream(ordersInputFile).pipe(ordersParser);
    //back up orders.csv file to OrderCsvBak folder
    backupCsv('orders');
}


function ParcelCheckStatus() {
  Parcel.findAll({where: {status: {$or: {$eq: null, $ne: 3}}}}).then(function(filter) {
      filter.forEach(function (parcel) {
          getParcelInfoFromAustralianPost(parcel);
          getParcelInfoFromCouriersPLease(parcel);
      });
  })
}

ParcelCheckStatus();


function getParcelInfoFromAustralianPost(parcel) {
    var request = require('request'),
    url = "http://digitalapi.auspost.com.au/track/v3/search?q="+ parcel.tracking_number,
    auth = "Basic cHJvZF90cmFja2FwaTpXZWxjb21lQDEyMw";

    request(
        {
            url : url,
            headers : {
                "Authorization" : auth
            }
        },
        function (error, response, body) {
            let article = JSON.parse(body).QueryTrackEventsResponse.TrackingResults[0].Consignment.Articles[0];
            if (article) {
              let statusCode = (article.Status==='Delivered')? 3 : -1;
              let deliveryTime = article.Events[0].EventDateTime;
              updateParcelInfo(parcel, statusCode, deliveryTime);
            } else {
              console.log('no scan events found');
            }
        }
    )
}


function getParcelInfoFromCouriersPLease(parcel) {

    var request = require('request')
    var postData = {strClientCode: "CPPLW", strServiceCode: 123, strCode: parcel.tracking_number};
    var url = 'https://www.couriersplease.com.au/DesktopModules/EzyTrack/EzyTrackHandler/CPPL_EzyTrackHandler.ashx?Type=TrakingJsonUser_v2';
    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: url,
    }

    request(options, function (err, res, body) {
      if (err) {
        console.log('Error :', err)
        return
      }
      var result = JSON.stringify(body);
      var checkEvent = JSON.parse(result).MainRootNode.Root;

      if (checkEvent[0]) {
        var parcelStatus = JSON.parse(result).MainRootNode.Root[0].TrakingInfo;
        var statusResult = parcelStatus[parcelStatus.length-1].Action.search("delivered");
        var deliveryTime = parcelStatus[parcelStatus.length-1].Date;
        updateParcelInfo(parcel, statusResult, deliveryTime);
      } else {
        console.log('no scan events found');
      }
    });
}

function updateParcelInfo(parcel, statusCode, deliveryTime) {

    if (statusCode === -1) {
        parcel.update({status: 2}).then(function() {
            console.log("updated parcel status to Processing");
        })
    } else {
        parcel.update({ status: 3 , delivery_time: deliveryTime}).then(function() {
            console.log("updated parcel status and delivery time");
        });
        Order.update({status:3}, {where: {id:parcel.order_id}}).then(function() {
            console.log("updated order status");
        })
    }
}


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

export function getFastSLowByDays(speed, fromDate, toDate) {

    var newFromDate = moment(fromDate).format('YYYY-MM-DD');
    var newToDate = moment(toDate).format('YYYY-MM-DD');
    var condition = (speed === 'fastest') ? "MIN" : "MAX";

    return  Order.sequelize.query(
    "SELECT * FROM orders RIGHT JOIN parcels ON orders.id = parcels.order_id WHERE (DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) = (SELECT " + condition + "(DATE_PART('day', filterResults.delivery_time::timestamp - filterResults.invoice_date::timestamp)) FROM (SELECT * FROM orders RIGHT JOIN parcels ON orders.id = parcels.order_id WHERE orders.invoice_date >='"+ newFromDate +"' AND orders.invoice_date <='"+ newToDate +"') AS filterResults)) ",
    { type: Sequelize.QueryTypes.SELECT}).then(function(orders)
        {
            return orders;
        })
}

export function getFast(speed, fromDate, toDate) {
    var condition = (speed === 'fastest') ? "MIN" : "MAX";
    var newFromDate = moment(fromDate).format('YYYY-MM-DD');
    var newToDate = moment(toDate).format('YYYY-MM-DD');

    return  Order.sequelize.query(
      "SELECT " + condition + "(DATE_PART('day', filterResults.delivery_time::timestamp - filterResults.invoice_date::timestamp)) FROM (SELECT * FROM orders RIGHT JOIN parcels ON orders.id = parcels.order_id WHERE orders.invoice_date >='"+ newFromDate +"' AND orders.invoice_date <='"+ newToDate +"') AS filterResults",
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

export function getAllParcels(trackingNumber, createdAt, deliveryTime,logisticId) {
    var selectConditionTwo =
        (deliveryTime === '2') ?
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) <=2" :
        (deliveryTime === '3') ?
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) <= 5 AND DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) >= 3" :
        "DATE_PART('day', parcels.delivery_time::timestamp - orders.invoice_date::timestamp) >5";

    var selectConditionOne =
        (trackingNumber != 'any') ? { where: { tracking_number: trackingNumber } } :
        (createdAt != 'any') ? { where: {status: {$ne: 3}}, include:[{model: Order, where: {invoice_date: {$lt: createdAt}}}] } :
        {order: '"id" ASC'};

    if (deliveryTime != 'any' && logisticId != 'any') {
        return Parcel.sequelize.query("SELECT * FROM parcels RIGHT JOIN orders ON orders.id = parcels.order_id WHERE parcels.logistic_id=" + logisticId+" AND " + selectConditionTwo , {type: Sequelize.QueryTypes.SELECT}).then(function(parcelsResult)
            {
                return parcelsResult;
            })
    } else {
        return Parcel.findAll(selectConditionOne);
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
