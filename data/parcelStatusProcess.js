import { Order, Parcel } from './database';
import request from 'request';

export function parcelCheckStatus() {
  Parcel.findAll({where: {status: {$or: {$eq: null, $ne: 3}}}}).then(function(filter) {
    filter.forEach(function (parcel) {
      if (parcel.carrier === 'Australia Post') {
        getParcelInfoFromAustraliaPost(parcel);
      } else if (parcel.carrier === 'Couriers Please') {
        getParcelInfoFromCouriersPlease(parcel);
      } else if (parcel.carrier === 'TNT') {
        console.log("LATER.....");
      }
    });
  })
}

function postCheckAustraliaPostParcelInfo(trackingResult, parcel) {
  let descriptions = trackingResult.ReturnMessage.Description;
  if (descriptions === 'Item Does not Exists') {
    console.log(parcel.tracking_number + " not exist");
  } else if (descriptions === 'Success') {
    let article = trackingResult.Consignment.Articles[0];
    if (article) {
      let statusCode = (article.Status==='Delivered')? 3 : -1;
      let deliveryTime = article.Events[0].EventDateTime;
      updateParcelInfo(parcel, statusCode, deliveryTime);
    } else {
      console.log('no scan events found');
    }
  }
}

function postCheckCouriersPleaseParcelInfo(trackingResult, parcel) {
  let result = JSON.parse(trackingResult);
  if (!result.Status) {
    var checkEvent = result.MainRootNode.Root;
    if (checkEvent[0]) {
      var parcelStatus = result.MainRootNode.Root[0].TrakingInfo;
      var statusResult = parcelStatus[parcelStatus.length-1].Action.search("delivered");
      var deliveryTime = parcelStatus[parcelStatus.length-1].Date;
      updateParcelInfo(parcel, statusResult, deliveryTime);
    } else {
      console.log('no scan events found');
    }
  }
}


export function australiaPostTrackAParcel(trackingNumber) {
  var url = "http://digitalapi.auspost.com.au/track/v3/search?q="+ trackingNumber,
  auth = "Basic cHJvZF90cmFja2FwaTpXZWxjb21lQDEyMw==";
  var promise = new Promise(function (resolve, reject){
    request(
      {
        url : url,
        headers : {
          "Authorization" : auth
        }
      },
      function (error, response, body) {
        if(error) {
          reject(error);
        } else {
          resolve(body);
        }
      }
    )
  });
  return promise;
}

export function couriersPleaseTrackAParcel(trackingNumber) {
  var postData = {strClientCode: "CPPLW", strServiceCode: 123, strCode: trackingNumber },
    url = 'https://www.couriersplease.com.au/DesktopModules/EzyTrack/EzyTrackHandler/CPPL_EzyTrackHandler.ashx?Type=TrakingJsonUser_v2',
    options = {
      method: 'post',
      body: postData,
      json: true,
      url: url,
      withCredentials: false
    };
  var promise = new Promise(function (resolve, reject){
    request(options, function (err, res, body) {
      if (err) {
        reject(error);
      } else {
        resolve(body);
      }
    })
  });
  return promise;
}

function getParcelInfoFromAustraliaPost(parcel) {
  australiaPostTrackAParcel(parcel.tracking_number).then(function(body) {
    let trackingResult = JSON.parse(body).QueryTrackEventsResponse.TrackingResults[0];
    postCheckAustraliaPostParcelInfo(trackingResult, parcel)
  });
}

function getParcelInfoFromCouriersPlease(parcel) {
  couriersPleaseTrackAParcel(parcel.tracking_number).then(function(body) {
    let trackingResult = JSON.stringify(body);
    postCheckCouriersPleaseParcelInfo(trackingResult, parcel)
  });
}

function updateParcelInfo(parcel, statusCode, deliveryTime) {
  function updates(argument1,argument2) {
    parcel.update(argument1).then(function() {
      console.log("updated parcel status !");
    }).catch(function(e) {
      console.log("Parcel update failed !");
    });
    Order.update(argument2, {where: {id:parcel.order_id}}).then(function() {
      console.log("updated order status");
    }).catch(function(e) {
      console.log("Order update failed !");
    })
  }

  let argument1 = (statusCode === -1) ? { status: 2 } : { status: 3 , delivery_time: deliveryTime };
  let argument2 = (statusCode === -1) ? { status: 2 } : { status:3 };

  updates(argument1,argument2);
}
