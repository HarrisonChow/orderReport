import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {schema} from './data/schema';
import moment from 'moment';

var csv = require("fast-csv");
var fs = require('fs');
var pgp = require('pg-promise')();
var util = require('util');

const APP_PORT = 3333;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({schema, pretty: true, graphiql: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
const compiler = webpack({
  entry: path.resolve(__dirname, 'js', 'app.js'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/,
      },
    ],
  },
  output: {filename: 'app.js', path: '/'},
});
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/js/',
  stats: {colors: true},
});
// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});



// backup files name format
function myDateSTring(){
  var timeInMs = new Date();
  var dateTime = moment(timeInMs).format("YYYY-MM-DD HH:mm:ss");
  return dateTime;
}
// create backup files and save to 'data/CSVbak'
csv
  .fromPath("data/test2.csv", {headers: true})
  .pipe(csv.createWriteStream({headers: true}))
  .pipe(fs.createWriteStream("data/CSVbak/CSV_bak_"+myDateSTring()+".csv", {encoding: "utf8"}));
//delete backup files if the file modified date is longer than 15 days
var files = fs.readdirSync("data/CSVbak/");
for (var i = 0; i < files.length; i++) {
  try {
    var stats = fs.statSync("data/CSVbak/"+files[i]).mtime.getTime();
    var today = new Date().getTime();
    var setDeleteTime = (today - stats)/(1000*60*60*24);
    if (setDeleteTime >= 15) {
      fs.unlinkSync("data/CSVbak/"+files[i]);
    }
  }
  catch(err) {
      console.log('it does not exist');
  }
}

// connect databse
// read CSV file and save the data to databse.
var cn = {
    host: 'localhost',
    database: 'orders_report',
    user: 'postgres',
    password: 'postgres'
};

var db = pgp(cn);

//Transform a lot of inserts into one
function Inserts(template, data) {
    if (!(this instanceof Inserts)) {
        return new Inserts(template, data);
    }
    this._rawDBType = true;
    this.formatDBType = function () {
        return data.map(d=>'(' + pgp.as.format(template, d) + ')').join(',');
    };
}

//insert Template
function Insert() {
  return {
    id: null,
    invoice_number: null,
    status: null,
    invoice_date: null,
    billing_firstname: null,
    billing_lastname: null,
    billing_email: null,
    billing_phone: null,
    billing_street: null,
    billing_suburb: null,
    billing_postcode: null,
    billing_state: null,
    grand_total: null,
    shipping_amount: null,
  }
}

var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream('data/test2.csv')
    });


var n=0;
var InsertArray = [];

lineReader.on('line', function(line) {
      var insert = new Insert();
      n++;
      var InsertValues=line.split(',');
      var i=0;
      for (var prop in insert){
          insert[prop] = (InsertValues[i]=='')?insert[prop]:InsertValues[i];
          i++;
      }
      InsertArray.push(insert);
      console.log(InsertArray);
      if (n==10000){
          lineReader.pause();

          //convert insert array into one insert
          var values = new Inserts('${invoice_number}, ${status},${invoice_date},${billing_firstname},${billing_lastname},${billing_email},${billing_phone},${billing_street},${billing_suburb},${billing_postcode},${billing_state},${grand_total},${shipping_amount}', InsertArray);
          console.log(values);
          db.none('INSERT INTO orders (invoice_number, status, invoice_date,billing_firstname, billing_lastname, billing_email, billing_phone, billing_street, billing_suburb, billing_postcode, billing_state, grand_total, shipping_amount) VALUES $1', values)
            .then(data=> {
                n=0;
                InsertArray=[];
                lineReader.resume();
            })
            .catch(error=> {
                console.log(error);
            });
      }

      //
});

lineReader.on('close',function() {
     console.log('end '+n);
     //last insert
     if (n>0) {
         var values = new Inserts('${invoice_number}, ${status},${invoice_date},${billing_firstname},${billing_lastname},${billing_email},${billing_phone},${billing_street},${billing_suburb},${billing_postcode},${billing_state},${grand_total},${shipping_amount}', InsertArray);
         db.none('INSERT INTO orders (invoice_number, status, invoice_date,billing_firstname, billing_lastname, billing_email, billing_phone, billing_street, billing_suburb, billing_postcode, billing_state, grand_total, shipping_amount) VALUES $1', values)
            .then(data=> {
                console.log('Last');
            })
            .catch(error=> {
                console.log(error);
            });
     }
});
