"use strict";

/*
* Requires loadScript("https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.js");
* we should call ^ before loading this script
*/

const authLoadedEvent = "auth.loaded";

const authID = "authToken";

const sessionId = "sessionid";
const addressKey = "address";
const signatureKey = "signature";
const userIdKey = "uid";
const issueTimeKey = "iat";
const expTimeKey = "exp";

const host = "https://api-crypto.fusedvr.com"

function ChainAuthLogin(email, myAddress, signature, successFn, failFn) {
  apiCall( "auth/connectWeb3" , 
    {
      email: email,
      address: myAddress,
      signedNonce: signature
    },
    function(data) {
      if (data.token) { //got token, so successful authorization
        localStorage.setItem(authID, data.token);
      }
      successFn(data);
    }, failFn );
}

function getTokenValue(key){
  return jwt_decode(getToken())[key];
}

function getToken() {
  var token = localStorage.getItem(authID);
  if (token){
    if (isTokenValid(token)){
      return token;
    } else {
      return false;
    }
  } else {
    return false;
  }
  
  function isTokenValid(token) {
    let exp = Number(jwt_decode(token)[expTimeKey]) * 1000;
    return Date.now() <= exp;
  }
}

function logout() {
  localStorage.removeItem(authID);
}

async function apiCall(apiName, payload, successFn, errFn) {
  var apiPayload = {};
  if (payload instanceof FormData) {
    apiPayload = { type: "POST", url: host + "/api/" + apiName, 
      data: payload,
      success: successFn, 
      processData: false,
      contentType: false,
      error: errFn
    };
  } else {
    apiPayload = { type: "POST", url: host + "/api/" + apiName, 
      data: payload,
      success: successFn, 
      error: errFn
    };
  }

  var token = getToken();
  if (token) {
    apiPayload["headers"] = { 'Authorization': 'Bearer ' + token };
  }

  await jQuery.ajax(apiPayload);
}

function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

loadScript("https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.js", function(){
  jQuery(window).trigger(authLoadedEvent);
});