"use strict";

/**
 * Main entry point.
 */

function init() {
  var address = getTokenValue(addressKey);
  jQuery("#profile").html( address.slice(0, 7) + "..." + address.substring(address.length - 5) );
  jQuery("#logout").click(function(){
    logout();
    window.location.href = '/';
  });

  let favIcon = jQuery('<link>', {rel: "icon", type: "image/x-icon", href: "/assets/img/logo/logo.png"});
  jQuery("head").append(favIcon);
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

jQuery(window).on("auth.loaded", function (e) {
    if (!getToken()) {
      window.location.href = '/login.html';
    }

    init();
});

loadScript("assets/js/chainauth/authentication.js");