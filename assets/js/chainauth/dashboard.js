"use strict";

/*
* Requires loadScript("https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.js");
* we should call ^ before loading this script
*/


async function GetMyApps() {
  var apps = []; 
  await apiCall( "apps" , 
    {},
    function(data) {
      apps = data;
    }, function(request, status, error) { console.log(request.responseText); });

  return apps;
}

function showApp(appId, name, profilePic=null) {
  $("#apps").append(
    '<div class="col-lg-4 col-md-6">' +
      '<a href="/showapp.html?id=' +  appId + '">' +
        '<div class="appid">' + 
          '<div class="apptit d-flex justify-content-between">' +
            '<p> ID: ' + appId + '</p>' +
            '<i disabled class="fa fa-trash-o appDelete"></i>' + 
          '</div>' +
          '<h1>' + name + '</h1>' + 
          '<div class="d-flex justify-content-between align-items-end">' + 
            '<p></p>' +
            '<img src="' + (profilePic != null ? profilePic : "assets/img/application/photo.png") + '" width=100 height=100>' + 
          '</div>' +
        '</div>' +
      '</a>' +
    '</div>'
  );
}

$(window).on("auth.loaded", async function (e) {
    var apps = await GetMyApps();
    for (var i = 0; i < apps.length; i++) {
      showApp(apps[i].id , apps[i].name, apps[i].profile != null ? apps[i].profile.url : null);
    }

    $(".appDelete").on("click", function(){
      console.log("Delete");
      //setup an alert modal
      return false;
    });
});
