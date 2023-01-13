"use strict";

/*
* Requires loadScript("https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.js");
* we should call ^ before loading this script
*/

const freeTryButton = "#freeTry";
const caskOnRiseButton = "#ontherisePlan";
const caskTakeOffButton = "#takeoffPlan";

const apiCallKey = "apiCalls";
const sentMailKey = "emailCalls";

const maxAPIKey = "apiLimit";
const maxEmailKey = "emailLimit";

const onTheRisePlanId = "2938218295";
const takeOffPlanId = "3666810638";

jQuery(window).on("auth.loaded", async function (e) {
  jQuery(caskOnRiseButton).attr( "plan", onTheRisePlanId  );
  jQuery(caskTakeOffButton).attr( "plan", takeOffPlanId );

  jQuery(caskOnRiseButton).attr( "ref", getTokenValue(userIdKey)  );
  jQuery(caskTakeOffButton).attr( "ref", getTokenValue(userIdKey) );

  var details = await GetAppDetails();
  updateDetail(details);
  updateSubOptions(details);
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

function updateSubOptions(details) {
  var id = "0x" + BigInt(details.subId).toString(16);

  if (details.planId == onTheRisePlanId) {
    let caskOnRise = jQuery( freeTryButton ).clone().appendTo( jQuery(caskOnRiseButton).parent() );
    caskOnRise.text("Your Plan");
    caskOnRise.attr("href", "https://app.cask.fi/#/flow/subscription/" + id);

    jQuery(caskOnRiseButton).remove();
    jQuery(caskTakeOffButton).attr("disabled", "disabled");
  } else if (details.planId == takeOffPlanId) {

    let takeoffPlan = jQuery( freeTryButton ).clone().appendTo( jQuery(caskTakeOffButton).parent() );
    takeoffPlan.text("Your Plan");
    takeoffPlan.attr("href", "https://app.cask.fi/#/flow/subscription/" + id);

    jQuery(caskTakeOffButton).remove();
    jQuery(caskOnRiseButton).attr("disabled", "disabled");
  } else if (details.planId.includes("free")) {
    jQuery(freeTryButton).text("Your Plan");
  }
}