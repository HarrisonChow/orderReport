import {deleteCsv, insertOrderTable} from '../data/processCsv';
import {ParcelCheckStatus} from '../data/parcelStatusProcess';

const ordersInputFile='data/orders.csv';
const parcelsInputFile='data/parcels.csv';
export function parcelChecking() {
insertOrderTable(ordersInputFile);
deleteCsv('orders');
deleteCsv('parcels');
ParcelCheckStatus();
}
