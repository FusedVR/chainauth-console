"use strict";

/*
* Requires loadScript("https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.js");
* we should call ^ before loading this script
*/

const idKey = "id";
const nameKey = "name";
const descriptionKey = "description";

const apiCallKey = "apiCalls";
const sentMailKey = "emailCalls";

async function GetAppDetails(id) {
  var details = {}; 
  await apiCall( "apps/show" , 
    {id : id},
    function(data) {
      details = data;
    }, function(request, status, error) { console.log(request.responseText); });

  return details;
}

function updateDetail(details) {
  if (idKey in details){
    $("#appId").text("App Id: " + details[idKey]);
  }

  if (nameKey in details){
    $("#appName").attr("value", details[nameKey]);
  }

  if (descriptionKey in details) {
    $("#appDesc").text(details[descriptionKey]);
  }

  if (apiCallKey in details) {
    $("#apisCalled").text("Total APIs Called : " + details[apiCallKey]);
    //$("#maxAPI").text(details[maxAPIKey]);
    //$("#apiBar").css("width", (details[apiCallKey] / details[maxAPIKey] * 100) + "%");
  }

  if (sentMailKey in details) {
    $("#emailsCalled").text("Total Emails Sent : " + details[sentMailKey]);
    //$("#maxEmail").text(details[maxEmailKey]);
    //$("#emailBar").css("width", (details[sentMailKey] / details[maxEmailKey] * 100) + "%");
  }

  if (details.profile != null) {
    $("#appProfile").attr('src', details.profile.url);
  }
}

$(window).on("auth.loaded", async function (e) {
    let params = new URLSearchParams(location.search);
    var details = await GetAppDetails(params.get('id'));
    updateDetail(details);

    $("input[type='image']").click(function() {
      $("input[id='updateProfile']").click();
    });

    $("input[id='updateProfile']").on('change', async function () {
        var formData = new FormData();
        formData.append('id', params.get('id'));
        formData.append('profile', $('#updateProfile')[0].files[0]);

        await apiCall( "apps/update" , 
          formData,
          function(data) {
            $("#appProfile").attr('src', data.profile.url);
          }, function(request, status, error) { 
            if (request.responseText){
              showAlert( request.responseText  );
            }
          }
        );
    });

    $("#updateMeta").on('click', async function() {
      await apiCall( "apps/update" , 
          {
            id : params.get('id'),
            name : $("#appName").val(), 
            description : $("#appDesc").val()
          },
          function(data) {
            console.log(data); //data is already updated
          }, function(request, status, error) { 
            if (request.responseText){
              showAlert( request.responseText  );
            }
          }
      );
    });
});

function showAlert(message) {
    let modal = $('#alertlocation');
    modal.html('<div class="alert alert-danger alert-dismissible fade in show" role="alert" id="alert">' +
          message + 
          '<button type="button" class="close" data-dismiss="alert">×</button>' +
        '</div>');
}