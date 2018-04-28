var youtubeWidget = function(){
	var player = null;
  	var vidID = "";
	return {
		findVideo: function(aiData){
			var videoTitle = aiData.parameters.title;
    		var responseText = aiData.fulfillment.speech;
    		var queryString = encodeURIComponent(videoTitle.trim());
    		utilWidget.clearFeedbackArea();
    		$('#voice').html('<div id="youtubeIframe">Loading Video...</div>');
    		$.getJSON({
        		type: 'GET',
        		dataType: "json",
        		async: true,
        		url: '/youtube?subject=' + queryString,
        		success: function(data) {
            		youtubeWidget.addVideo(data);
            		responsiveVoice.speak(responseText + " " + videoTitle);
        		}
    		});	
		},
		addVideo: function(videoData){
			var $youtubeAPIScriptTag = $("<script>", {src: "https://www.youtube.com/iframe_api"});
			$('script').first().before($youtubeAPIScriptTag);
    		var rand = Math.floor(Math.random() * 5);
    		youtubeWidget.vidID = videoData[rand].id;

    		if(typeof window.YT !== 'undefined'){
      			$('#youtubeIframe').empty();
    			youtubeWidget.player = new window.YT.Player('youtubeIframe', {
        			height: '345',
        			width: '630',
        			videoId: youtubeWidget.vidID,
        			events: {
            			'onReady': youtubeWidget.playVideo
        			}
    			});
    		}
		},
		playVideo: function() {
			if(youtubeWidget.player !== null) youtubeWidget.player.playVideo();
  			responsiveVoice.speak("Playing Video", voiceWidget.voicePlaybackPersonel);
		},
		stopVideo: function(aiData) {
  			var responseText = aiData.fulfillment.speech;
  			if(player !== null) player.stopVideo();
  			responsiveVoice.speak(responseText, voiceWidget.voicePlaybackPersonel);
		},
		pauseVideo: function(aiData) {
  			var responseText = aiData.fulfillment.speech;
  			if(player !== null) player.pauseVideo();
  			responsiveVoice.speak(responseText, voiceWidget.voicePlaybackPersonel);
		},
		muteVideo: function(){
  			if(player !== null){
				if(player.isMuted()){
				player.unMute();
      			responsiveVoice.speak("video unmuted", voiceWidget.voicePlaybackPersonel);
				}else{
				player.mute();
      			responsiveVoice.speak("video muted", voiceWidget.voicePlaybackPersonel);
				}
			}
		},
		getVidId: vidID
	}
}();


//required by the youtubeIframeApi
//must be in the global scope
function onYouTubeIframeAPIReady() {
	youtubeWidget.player = new YT.Player('youtubeIframe', {
		height: '345',
		width: '630',
		videoId: youtubeWidget.vidID,
		events: {
			'onReady': youtubeWidget.playVideo
		}
	});
}