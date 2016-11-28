
var request = require('request');
// var http = require('http');


module.exports = function(trackingNumber, carrierName) {
    if (carrierName === 'Couriers Please') {
        var postData = {strClientCode: "CPPLW", strServiceCode: 123, strCode: trackingNumber };
        var url = 'https://www.couriersplease.com.au/DesktopModules/EzyTrack/EzyTrackHandler/CPPL_EzyTrackHandler.ashx?Type=TrakingJsonUser_v2';
        var options = {
            method: 'post',
            body: postData,
            json: true,
            url: url,
            withCredentials: false
        };

        request(options, function (err, res, body) {
            if (err) {
                console.log('Error :', err);
            }
            var result = JSON.stringify(body);
            var checkEvents = JSON.parse(result).MainRootNode.Root[0].TrakingInfo;
            checkEvents.shift();
            var parcelDetails = checkEvents.map(function(parcel) {
                var message =
                "Date: " + parcel.Date + "<br />" +
                "Time: " + parcel.time + "<br />" +
                "Status: " + parcel.Action +"<br /><br />";
                return message;
            })
            document.getElementById('details').innerHTML = parcelDetails.join(" ");
        });
    } else if (carrierName === 'Australia Post') {
        // var request = http.request({
        //                       host: 'digitalapi.auspost.com.au',
        //                       path: '/track/v3/search?q=APP3115931',
        //                       auth: 'Basic cHJvZF90cmFja2FwaTpXZWxjb21lQDEyMw=='
        //                      },
        //                      function (response) {
        //                        console.log(response);
        //                        response.on('data', function (chunk) {
        //                          console.log('BODY: ' + chunk);
        //                        });
        //                      });
        //                      request.end();

        var url = 'http://digitalapi.auspost.com.au/track/v3/search?q='+trackingNumber;
        var auth = 'Basic cHJvZF90cmFja2FwaTpXZWxjb21lQDEyMw==';
        var options = {
            url : url,
            headers : {
                'Authorization' : auth,
            },
        };



        request.get(options, function (error, response, body) {
          console.log(response);
                // let descriptions = JSON.parse(body).QueryTrackEventsResponse.TrackingResults[0].ReturnMessage.Description;
                // if (descriptions === 'Item Does not Exists') {
                //     console.log(parcel.tracking_number + ' not exist');
                // } else if (descriptions === 'Success') {
                //     let article = JSON.parse(body).QueryTrackEventsResponse.TrackingResults[0].Consignment.Articles[0];
                //     if (article) {
                //         let statusCode = (article.Status==='Delivered')? 3 : -1;
                //         let deliveryTime = article.Events[0].EventDateTime;
                //         updateParcelInfo(parcel, statusCode, deliveryTime);
                //     } else {
                //         console.log('no scan events found');
                //     }
                // }
            }
        )
    }
};
