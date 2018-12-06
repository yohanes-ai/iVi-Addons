const TOTAL_MONITOR = 4;

function onError(error) {
  console.log(`Error: ${error}`);
}

function saveProfile(profiler){
  let setting = browser.storage.local.set({profiler});
  setting.then(null, onError);
}

$(document).ready(function() {
    let url1 = $("#url1");
    let url2 = $("#url2");
    let url3 = $("#url3");
    let url4 = $("#url4");
    let mode = $("#incognito").is(':checked');

    let profiler = {
      "url" : new Array(4),
      "mode" : false
    };

    let savedProfile = browser.storage.local.get("profiler");

    savedProfile.then(function(data){
      if(data.profiler){
        for(i = 0; i < TOTAL_MONITOR; i++){
          profiler.url[i] = data.profiler.url[i];
        }
        profiler.mode = data.profiler.mode;

        url1.val(profiler.url[0]);
        url2.val(profiler.url[1]);
        url3.val(profiler.url[2]);
        url4.val(profiler.url[3]);

        if(profiler.mode == true){
          $('#incognito').prop('checked', true);
        }else{
          $('#incognito').prop('checked', false);
        }
      }
    }, onError);

    url1.focusout(function(event) {
      if(url1.val())
        profiler.url[0] = url1.val();
      saveProfile(profiler);
    });

    url2.focusout(function(event) {
      if(url2.val())
        profiler.url[1] = url2.val();
      saveProfile(profiler);
    });

    url3.focusout(function(event) {
      if(url3.val())
        profiler.url[2] = url3.val();
      saveProfile(profiler);
    });

    url4.focusout(function(event) {
      if(url4.val())
        profiler.url[3] = url4.val();
      saveProfile(profiler);
    });

    $('#incognito').change(function(){
        if($(this).is(':checked')){
          profiler.mode = true;
        }else{
          profiler.mode = false;
        }
        saveProfile(profiler);
    });
});
