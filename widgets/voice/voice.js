//global variables for youtube player
var voiceWidget = function(){
  var voicePlaybackPersonel = "UK English Female";
  var confirmbeep = new Audio('./widgets/voice/confirm.wav');
  return {
    getVoicePlayBackPersonel: voicePlaybackPersonel,
    setSleepMode: function(sleep){
      voiceWidget.sleepMode = sleep;
    },
    loadScripts: function(){
      $.getScript("./widgets/voice/util.js", function(){ utilWidget.loadWelcomeMessage()});
      $.getScript("./widgets/voice/image.js");
      $.getScript("./widgets/voice/youtube.js");
      $.getScript("./widgets/voice/camera.js");
    },
    startVoice: function(){
      if (annyang) {
        // Add our commands to annyang
        var commands = {
          '*text' : voiceWidget.sendToAI
        };

        // Add our commands to annyang
        annyang.addCommands(commands);
  
        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
      }
    },
    sendToAI: function(text){
      confirmbeep.play();
      console.log(text);
      $.getJSON({
        type: 'GET',
        dataType: "json",
        async: true,
        url: '/ai?text=' + text,
        success: function(data) {
            var intent = data.action;
            var responseText = data.fulfillment.speech;
            console.log(intent);
            console.log(responseText);
            console.log(data);
            if(!utilWidget.getSleepMode){
                switch(intent){
                case 'image.search':
                  imageWidget.showImages(data);
                  break;
                case 'image.enlarge':
                  imageWidget.enlargePicture(data);
                  break;
                case 'video.search':
                  youtubeWidget.findVideo(data);
                  break;
                case 'video.play':
                  youtubeWidget.playVideo(data);
                  break;
                case 'video.pause':
                  youtubeWidget.pauseVideo(data);
                  break;
                case 'video.stop':
                  youtubeWidget.stopVideo(data);
                  break;
                case 'video.mute':
                  youtubeWidget.muteVideo(data);
                  break;
                case 'display.sleep':
                  utilWidget.setSleepMode(data);
                  break;
                case 'display.hide':
                  utilWidget.mirrorMode(data);
                  break;
                case 'display.reload':
                  utilWidget.reloadPage(data);
                  break;
                case 'display.clear':
                  utilWidget.soloClear(data);
                  break;
                case 'display.setting':
                  utilWidget.configURL(data);
                  break;
                case 'display.command':
                  utilWidget.showCommands(data);
                  break;
                case 'camera.picture':
                  cameraWidget.takePicture(data);
                  break;
                case 'camera.profile':
                  cameraWidget.detectProfile(data);
                  break;
                case 'camera.save':
                  cameraWidget.savePhoto(data);
                default:
                  responsiveVoice.speak(responseText);
                  break;
                }
            }else if(utilWidget.getSleepMode && intent === 'display.wake'){
              utilWidget.setSleepMode(data);
            }
        }
      });
    }, 
  }
}();

voiceWidget.loadScripts();
voiceWidget.startVoice();