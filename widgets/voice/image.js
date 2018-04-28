var imageWidget = function(){
	return {
		showImages: function(aiData){
  			utilWidget.clearFeedbackArea();
  			var picture = aiData.parameters.title;
  			var responseText = aiData.fulfillment.speech;
  			var queryString = encodeURIComponent(picture.trim());
  			$('#voice').html('<div id="pictures">Loading Images...</div>');
  			$.getJSON({
        		type: 'GET',
        		dataType: "json",
        		async: true,
        		url: '/pictures?subject=' + queryString,
        		success: function(data) {
            		imageWidget.addPictureSlide(data);
            		responsiveVoice.speak(responseText + " " + picture);
        		}
  			});
		},
		addPictureSlide: function(pictureData){
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
		},
		enlargePicture: function(aiData){
  			var choice = aiData.parameters.number;
  			var responseText = aiData.fulfillment.speech;
  			var filterChoice = utilWidget.commandCorrection(choice);
	  
  			$('#pictures').children('img').each(function(){
      			if($(this).hasClass("img-large") || $(this).hasClass("img-regular")){
          			$(this).removeClass("img-large");
          			$(this).removeClass("img-regular");
          			$(this).addClass("img-small");
      			}
  			});

  			$('#' + filterChoice).removeClass('img-small').addClass('img-large');
  			responsiveVoice.speak("Enlarging image " + choice.toString(), voiceWidget.voicePlaybackPersonel);
		}
	}
}();