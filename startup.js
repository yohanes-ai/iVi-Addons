let profiler = {
  "url" : new Array(4),
  "mode" : false
};

const TOTAL_MONITOR = 4;

function getCurrentWindow() {
  return browser.windows.getCurrent();
}

function onCreated(windowInfo) {
  console.log(`Created window: ${windowInfo.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function createWindow(i, display, currentWindow, incognito){
      if(profiler.url[i]){
        let mirror = browser.windows.create({
          url: profiler.url[i],
          state: "fullscreen",
          incognito: incognito
        });

        mirror.then((docking) => {
          if(i === 0)
            browser.windows.remove(currentWindow.id);
          console.log(i + " : " + profiler.url[i] + " " + display.x + " " + docking.id);
          let updateInfo = {
            left : display.x,
            width : screen.width,
            height : screen.height
          };

          browser.windows.update(docking.id, updateInfo);

          display.x += screen.width;

          if(i < TOTAL_MONITOR){
            createWindow(++i, display, currentWindow, incognito);
          }
        });
      }
      else{
        createWindow(++i, display, currentWindow, incognito);
      }
}

function getConfig(data, currentWindow){
    if(data.profiler){
        let x = 0;
        for(i = 0; i < TOTAL_MONITOR; i++){
          profiler.url[i] = data.profiler.url[i];
        }

        if(data.profiler.mode !== ""){
            profiler.mode = data.profiler.mode;

        }else{
            profiler.mode = false;
        }

        var display = {x : 1};
        createWindow(0, display, currentWindow, profiler.mode);
    }
}

function noConfig(){

}

getCurrentWindow().then((currentWindow) => {
  let savedProfile = browser.storage.local.get("profiler");
  savedProfile.then(function(data){
    getConfig(data, currentWindow);
  }, noConfig() );

});
