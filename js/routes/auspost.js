var express = require('express');
var router = express.Router();
import {australiaPostTrackAParcelttt} from '../../data/parcelStatusProcess';

router.get('/auspost', function(req, res) {

    res.send(
        australiaPostTrackAParcelttt('APP3115960')
    );
})

module.exports = router;
