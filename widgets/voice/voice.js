//global variables for youtube player
var player = null, vidID, done = false;
var voicePlaybackPersonel = "UK English Female";
var messages = [
    "Good morning!",
    "Hey there good lookin'!",
    "Long time no see.",
    "You could use a cup of coffee..",
    "Have a splendid day!",
    "Thanks for using SAM"
];
var confirmbeep = new Audio('./widgets/voice/confirm.wav');

loadWelcomeMessage(messages);
if (annyang) {
  // Add our commands to annyang
  var commands = {
    '*text' : sendToAI
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}

/*-----API AI-----*/
function sendToAI(text){
  confirmbeep.play();
  console.log(text);
  $.getJSON({
        type: 'GET',
        dataType: "json",
        async: false,
        url: '/ai?text=' + text,
        success: function(data) {
            var intent = data.action;
            var responseText = data.fulfillment.speech;
            console.log(intent);
            console.log(responseText);
            console.log(data);
            switch(intent){
              case 'image.search':
                showImages(data);
                break;
              case 'image.enlarge':
                enlargePicture(data);
                break;
              case 'video.search':
                findVideo(data);
                break;
              case 'video.play':
                playVideo();
                break;
              case 'video.pause':
                pauseVideo();
                break;
              case 'video.stop':
                stopVideo();
                break;
              case 'video.mute':
                muteVideo();
                break;
              case 'display.hide':
                mirrorMode();
                break;
              case 'display.reload':
                reloadPage();
                break;
              default:
                loadMessage(responseText);
                responsiveVoice.speak(responseText);
                break;
            }
            
        }
    });
}

/*-----Welcoming Message-----*/
function loadWelcomeMessage(messages) {
    var htmlId = '#voice';
    var rand = Math.floor(Math.random() * messages.length);
    var choice = messages[rand];
    $(htmlId).html(choice);
    responsiveVoice.speak(choice, voicePlaybackPersonel);
}

/*-----Load Message To Screen-----*/
function loadMessage(message){
    var htmlId = '#voice';
    $(htmlId).html(message);
}

/*-----Flickr Images Command-----*/
function showImages(aiData){
  clearFeedbackArea();
  var picture = aiData.parameters.title;
  var responseText = aiData.fulfillment.speech;
  var queryString = encodeURIComponent(picture.trim());
  $('#voice').html('<div id="pictures">Loading Images...</div>');
  $.getJSON({
        type: 'GET',
        dataType: "json",
        async: false,
        url: '/pictures?subject=' + queryString,
        success: function(data) {
            addPictureSlide(data);
            responsiveVoice.speak(responseText + " " + picture);
        }
  });
}

function addPictureSlide(pictureData){
  var referenceID = ["one", "two", "three", "four", "five"];
  $('#pictures').empty();
  for(var i = 0; i < pictureData.length; i++){
    var currentPicture = pictureData[i];
    var farm = currentPicture.farm;
    var serverID = currentPicture.server;
    var id = currentPicture.id;
    var secret = currentPicture.secret;
    var imgSrc = "https://c2.staticflickr.com/{farm}/{serverID}/{id}_{secret}.jpg"
    .replace('{farm}', farm)
    .replace('{serverID}', serverID)
    .replace('{id}', id)
    .replace('{secret}', secret);
    $('#pictures').append('<img id="' + referenceID[i] +'" class="img-regular" src="' + imgSrc + '">');
  }
}

function enlargePicture(aiData){
  var choice = aiData.parameters.number;
  var responseText = aiData.fulfillment.speech;
  var filterChoice = commandCorrection(choice);
  
  $('#pictures').children('img').each(function(){
      if($(this).hasClass("img-large") || $(this).hasClass("img-regular")){
          $(this).removeClass("img-large");
          $(this).removeClass("img-regular");
          $(this).addClass("img-small");
      }
  });

  $('#' + filterChoice).removeClass('img-small').addClass('img-large');
  responsiveVoice.speak("Enlarging image " + choice.toString(), voicePlaybackPersonel);
}

/*-----Youtube Video Command----*/
function findVideo(aiData) {
    var videoTitle = aiData.parameters.title;
    var responseText = aiData.fulfillment.speech;
    var queryString = encodeURIComponent(videoTitle.trim());
    clearFeedbackArea();
    $('#voice').html('<div id="youtubeIframe">Loading Video...</div>');
    $.getJSON({
        type: 'GET',
        dataType: "json",
        async: false,
        url: '/youtube?subject=' + queryString,
        success: function(data) {
            addVideo(data);
            responsiveVoice.speak(responseText + " " + videoTitle);
        }
    });
}

function addVideo(videoData) {
  //setup youtube iframe api
	var $youtubeAPIScriptTag = $("<script>", {src: "https://www.youtube.com/iframe_api"});
	$('script').first().before($youtubeAPIScriptTag);
    var rand = Math.floor(Math.random() * 5);
    vidID = videoData[rand].id;
    if(typeof window.YT !== 'undefined'){
      $('#youtubeIframe').empty();
    	player = new window.YT.Player('youtubeIframe', {
        height: '345',
        width: '630',
        videoId: vidID,
        events: {
            'onReady': playVideo
        	}
    	});
    }

}

//required by the youtubeIframeApi
//must be in the global scope
function onYouTubeIframeAPIReady() {
	player = new YT.Player('youtubeIframe', {
        height: '345',
        width: '630',
        videoId: vidID,
        events: {
            'onReady': playVideo
        }
    });
    console.log("player");
}

function playVideo() {
	if(player !== null) player.playVideo();
  responsiveVoice.speak("playing video", voicePlaybackPersonel);
}

function stopVideo() {
  if(player !== null) player.stopVideo();
  responsiveVoice.speak("stoping video", voicePlaybackPersonel);
}

function pauseVideo() {
  if(player !== null) player.pauseVideo();
  responsiveVoice.speak("pausing video", voicePlaybackPersonel);
}

function muteVideo(){
  if(player !== null){
		if(player.isMuted()){
			player.unMute();
      responsiveVoice.speak("video unmuted", voicePlaybackPersonel);
		}else{
			player.mute();
      responsiveVoice.speak("video muted", voicePlaybackPersonel);
		}
	}
}

/*-----Clean up commands----*/
function soloClear(){
  confirmbeep.play();
  player = null;
  $('#voice').empty();
  responsiveVoice.speak("clearing feedback area", voicePlaybackPersonel);
}

function clearFeedbackArea(){
  player = null;
	$('#voice').empty();
}

function reloadPage(){
  location.reload();
  responsiveVoice.speak("reloading", voicePlaybackPersonel);
}

/*-----Help Commands-----*/
function showCommands() {
  confirmbeep.play();
  clearFeedbackArea();
  responsiveVoice.speak("showing commands", voicePlaybackPersonel);
  $('#voice').html('<div id="commandsWrapper"><ul id="commands"></ul></div>');
  $.getJSON({
      type: 'GET',
      dataType: "json",
      async: false,
      url: '/commands',
      success: function(data) {
      	var $commandsList = $('#commands');
          for (var item in data) {
              $commandsList.append(`<li>
			<div id="command"><strong>"`+data[item].command+`"</strong></div>
			<div id="description">`+data[item].description+`</div>
		</li>`)
          }

      }
  });
  if ($('#commandsWrapper').height() > $('#voice').height()) {
    setInterval(function() {
      start();
    }, 5000);
	}

}

/*-----Mirror Mode Commands-----*/
function mirrorMode(word){
  if($('body').is(':visible') === true){
    responsiveVoice.speak("hiding display", voicePlaybackPersonel);
  }else{
    responsiveVoice.speak("Showing display", voicePlaybackPersonel);  
  }
  $('body').toggle("slow");
}

/*----- Show Config URL --------*/
function configURL() {
  confirmbeep.play();
  clearFeedbackArea();
  $.get('/ip', function(data) {
    $('#voice').html("Navigate to <strong>http://" + data + ":5000/settings</strong> on any other device to configure me!");
  });
  responsiveVoice.speak("Showing config access point", voicePlaybackPersonel);
}


/*-----Helper functions to make things look cool-----*/
function commandCorrection(word){
  var oneWords = ["one", "1"];
  var twoWords = ["too", "to", "two", "2"];
  var threeWords = ["tree", "three", "3"];
  var fourWords = ["for", "four", "4"];
  var fiveWords = ["five", "5"];
  var realWord = "";
  if($.inArray(word, oneWords) > -1){
    realWord = "one";
  }else if($.inArray(word, twoWords) > -1){
    realWord = "two";
  }else if($.inArray(word, threeWords) > -1){
    realWord = "three";
  }else if($.inArray(word, fourWords) > -1){
    realWord = "four";
  }else if($.inArray(word, fiveWords) > -1){
    realWord = "five";
  }

  return realWord;
}

function animateContent(direction) {
    var animationOffset = $('#voice').height() - $('#commandsWrapper').height();
    if (direction == 'up') animationOffset = 0;
    $('#commandsWrapper').animate({ "marginTop": (animationOffset) + "px" }, 5000);
}

function up() {
    animateContent("up");
}

function down() {
    animateContent("down");
}

function start() {
    setTimeout(function() {
        down();
    }, 2000);
    setTimeout(function() {
        up();
    }, 2000);
    setTimeout(function() {
        console.log("wait...");
    }, 5000);
}
