var express = require('express');
var router = express.Router();
import {couriersPleaseTrackAParcel} from '../../data/parcelStatusProcess';

router.get('/couriersP', function(req, res) {
  couriersPleaseTrackAParcel('CPWSAV900010108').then(function(body) {
    return res.send(body)
  })
})

module.exports = router;
