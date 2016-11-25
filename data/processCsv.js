import { Order,Parcel,Logistic} from './database';
import moment from 'moment';

const fs = require('fs');
const csv = require("fast-csv");
const http = require('http');
const parser = require('csv-parser');
const ordersInputFile = 'data/orders.csv';
const parcelsInputFile ='data/parcels.csv';

// create backup files and save to 'data/'
function backupCsv(files) {
    let filesCondition = (files === 'orders') ? "data/OrderCsvBak/ordersCsvBak" : "data/ParcelCsvBak/parcelsCsvBak";

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
export function deleteCsv(files) {
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
};

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

export function insertOrderTable(ordersInputFile){
    if(fs.existsSync(ordersInputFile)){
        fs.createReadStream(ordersInputFile)
        .pipe(parser({strict: true, separator: ','}))
        .on('data', function (data) {
            checkDuplicateData(Order, data.invoice_number).then(notExist => {
                if (notExist) {
                    var keys = Object.keys(data);
                    var allData = {};
                    for (var i = 0, l = keys.length; i < l; i++) {
                        allData[keys[i]] = data[keys[i]];
                    }
                    return Order.create(allData);
                }
            })
        })
        .on('end', function () {
            backupCsv('orders');
            fs.unlinkSync(ordersInputFile);
            if (fs.existsSync(parcelsInputFile)) {
                insertParcelTable(parcelsInputFile);
            }
        })
    }
}

function insertParcelTable(parcelsInputFile){
    fs.createReadStream(parcelsInputFile)
    .pipe(parser({strict: true, separator: ','}))
    .on('data', function (data) {
        checkDuplicateData(Parcel, data.invoice_number).then(notExist => {
        if (notExist) {
            Order.find({where: {invoice_number:data.invoice_number}}).then(function (result) {
                let orderID = JSON.stringify(result.id);
                Logistic.find({where: {name: data.carrier}}).then(function(result){
                    let logisticID = JSON.stringify(result.id);
                    var keys = Object.keys(data);
                    var allDatas = {};
                    allDatas.logistic_id = logisticID;
                    allDatas.order_id = orderID;
                    for (var i = 0; i < keys.length; i++) {
                        allDatas[keys[i]] = data[keys[i]];
                    }
                    return Parcel.create(allDatas);
                })
            });
        }
        })
    })
    .on('end', function() {
        backupCsv('parcels');
        fs.unlinkSync(parcelsInputFile);
    })
}
