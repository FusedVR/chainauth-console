"use strict";

/*
* Requires loadScript("https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.js");
* we should call ^ before loading this script
*/

const caskOnRiseButton = "#ontherisePlan";
const caskTakeOffButton = "#takeoffPlan";

const apiCallKey = "apiCalls";
const sentMailKey = "emailCalls";

const maxAPIKey = "apiLimit";
const maxEmailKey = "emailLimit";

jQuery(window).on("auth.loaded", async function (e) {
  jQuery(caskOnRiseButton).attr( "ref", getTokenValue(userIdKey)  );
  jQuery(caskTakeOffButton).attr( "ref", getTokenValue(userIdKey) );

  var details = await GetAppDetails();
  updateDetail(details);
});

async function GetAppDetails() {
  var details = {}; 
  await apiCall( "plans/mine" , 
    {},
    function(data) {
      details = data;
    }, function(request, status, error) { console.log(request.responseText); });

  return details;
}

function updateDetail(details) {
  if (apiCallKey in details) {
    jQuery("#apiCall").text(details[apiCallKey]);
    jQuery("#maxAPI").text(details[maxAPIKey]);
    jQuery("#apiBar").css("width", (details[apiCallKey] / details[maxAPIKey] * 100) + "%");
  }

  if (sentMailKey in details) {
    jQuery("#sentMail").text(details[sentMailKey]);
    jQuery("#maxEmail").text(details[maxEmailKey]);
    jQuery("#emailBar").css("width", (details[sentMailKey] / details[maxEmailKey] * 100) + "%");
  }
}