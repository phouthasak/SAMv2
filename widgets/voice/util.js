var utilWidget = function(){
	var sleepMode = false;
	var displayMode = true;
	var messages = [
      "Good morning!",
      "Hey there good lookin'!",
      "Long time no see.",
      "You could use a cup of coffee..",
      "Have a splendid day!",
      "Thanks for using SAM"
    ];
	return {
		mirrorMode: function(){
  			if(displayMode == true){
    			responsiveVoice.speak("hiding display", voiceWidget.getVoicePlayBackPersonel);
    			displayMode = false;
  			}else{
    			responsiveVoice.speak("Showing display", voiceWidget.getVoicePlayBackPersonel);  
    			displayMode = true;
  			}
  			$('#spot1').toggle("slow");
  			$('#spot2').toggle("slow");
  			$('#spot3').toggle("slow");
  			$('#spot4').toggle("slow");
  			$('#spot5').toggle("slow");
  			$('#spot6').toggle("slow");
  			$('#spot7').toggle("slow");
  			$('#spot8').toggle("slow");
		},
		setSleepMode: function(data){
			if(sleepMode){
    			//wake
    			utilWidget.mirrorMode();
    			$('#screensaver').empty();
    			sleepMode = false;
  			}else{
    			//go to sleep
    			utilWidget.mirrorMode();
    			$('#screensaver').empty();  
    			$('#screensaver').append('<img class="screensaver" src="css/screensaver.gif">');
    			sleepMode = true;
  			}
		},
    setListeningMode: function(listening){
      if(listening){
          //start listening
          $('#listeningIcon').append('<img class="listening" src="css/listening.gif">');
        }else{
          //stop listening
          $('#listeningIcon').empty();  
        }
    },
		loadWelcomeMessage: function(){
			var htmlId = '#voice';
    		var rand = Math.floor(Math.random() * messages.length);
    		var choice = messages[rand];
    		//$(htmlId).html(choice);
    		responsiveVoice.speak(choice, voiceWidget.voicePlaybackPersonel);
    		//responsiveVoice.speak("Happy national boyfriend day, Johnny.", voicePlaybackPersonel);
		},
		loadMessage: function(message){
			var htmlId = '#voice';
    		$(htmlId).html(message);
		},
		soloClear: function(aiData){
  			var responseText = aiData.fulfillment.speech;
  			player = null;
  			$('#voice').empty();
  			responsiveVoice.speak(responseText, voiceWidget.voicePlaybackPersonel);
		},
		clearFeedbackArea: function(){
			player = null;
			$('#voice').empty();
		},
		reloadPage: function(aiData){
			var responseText = aiData.fulfillment.speech;
  			location.reload();
  			responsiveVoice.speak(responseText, voiceWidget.voicePlaybackPersonel);
		},
		configURL: function(aiData){
			var responseText = aiData.fulfillment.speech;
  			utilWidget.clearFeedbackArea();
  			$.get('/ip', function(data) {
    			$('#voice').html("Navigate to <strong>https://" + data + ":8080/settings</strong> on any other device to configure me!");
  			});
  			responsiveVoice.speak(responseText, voiceWidget.voicePlaybackPersonel);
		},
		commandCorrection: function(word){
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
		},
		animateContent: function(direction){
			var animationOffset = $('#voice').height() - $('#commandsWrapper').height();
    		if (direction == 'up') animationOffset = 0;
    		$('#commandsWrapper').animate({ "marginTop": (animationOffset) + "px" }, 5000);
		},
		up: function(){
			utilWidget.animateContent("up");
		},
		down: function(){
			utilWidget.animateContent("down");
		},
		start: function() {
    		setTimeout(function() {
        		utilWidget.down();
    		}, 2000);
    		setTimeout(function() {
        		utilWidget.up();
    		}, 2000);
    		setTimeout(function() {
        		console.log("wait...");
    		}, 5000);
		},
		showCommands: function(){
			var responseText = aiData.fulfillment.speech;
  			utilWidget.clearFeedbackArea();
  			responsiveVoice.speak(responseText, voiceWidget.voicePlaybackPersonel);
  			$('#voice').html('<div id="commandsWrapper"><ul id="commands"></ul></div>');
  			$.getJSON({
      			type: 'GET',
      			dataType: "json",
      			async: true,
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
    			}, 3500);
			}
		},
		getSleepMode: sleepMode
	}	
}();