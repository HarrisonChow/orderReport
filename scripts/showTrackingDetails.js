
var request = require('request');

module.exports = function(trackingNumber) {

      var postData = {strClientCode: "CPPLW", strServiceCode: 123, strCode: "CPWSAV900010102" };
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
};
