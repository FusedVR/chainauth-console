"use strict";

/*
* Requires loadScript("https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.js");
* we should call ^ before loading this script
*/

const appName = "#appName";
const appDesc = "#appDesc";
const profile = "#upload-profile";

$(window).on("auth.loaded", async function (e) {
    $("#createApp").on('click', async function() {
      if (validation()) {
        var formData = new FormData();
        formData.append('name', $(appName).val());
        formData.append('description', $(appDesc).val());
        formData.append('profile', $(profile)[0].files[0]);

        await apiCall( "apps/create" , 
            formData,
            function(data) {
              window.location.href = '/showapp.html?id=' + data.id;
            }, function(request, status, error) {
              if (error) {
                showAlert(error);
              }
            }
        );
      }
    });

    $("input[id='upload-profile']").on('change', async function () {
      let file = $(profile)[0].files[0];
      if (file.type == "image/png" || file.type == "image/jpeg") {
        var reader = new FileReader();
        reader.onload = function (e) {
          $('#preview').attr('src', e.target.result).width(400).height(400);
        };

        reader.readAsDataURL(file);
      } else {
        $(profile).val('');
        $('#preview').attr('src', "assets/img/application/upload.png").width(400).height(400);
        showAlert("Only PNG or JPEG images supported at this time");
      }

    });
});

function showAlert(message) {
    let modal = $('#alertlocation');
    modal.html('<div class="alert alert-danger alert-dismissible fade in show" role="alert" id="alert">' +
          message + 
          '<button type="button" class="close" data-dismiss="alert">×</button>' +
        '</div>');
}

function validation(){
  var errors = 0;
  var message = "";
  if ($(appName).val() === "") {
    message = "App Name"; 
    errors++;
  }

  if ($(appDesc).val() === "") {
    message += (message === "" ? "" : ", ") + "App Description"; 
    errors++;
  }

  let file = $(profile)[0].files[0];
  if (file == undefined || (file.type != "image/png" && file.type != "image/jpeg") ) {
    message += (message === "" ? "" : ", ") + "Profile Image"; 
    errors++;
  }

  if (errors > 0) {
    showAlert(message + (errors == 1 ? " is" : " are") + " missing!" )
    return false;
  }

  return true;
}