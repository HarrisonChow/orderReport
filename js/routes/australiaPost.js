var express = require('express');
var router = express.Router();
import {australiaPostTrackAParcel} from '../../data/parcelStatusProcess';

router.get('/auspost', function(req, res) {
  australiaPostTrackAParcel('APP3115960').then(function(body) {
    return res.send(body)
  })
})

module.exports = router;
