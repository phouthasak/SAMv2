var cameraWidget = function(){
  return {
    takePicture: function(aiData){
      var width = 350;
      var video = $('#webcam')[0];
      var canvas = $('#canvasPic')[0];
      var context = canvas.getContext('2d');
      var height = video.videoHeight / (video.videoWidth/width)
      var data;
      $('#canvasPic').eq(0).show();
      if(width && height){
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        utilWidget.clearFeedbackArea();
        data = canvas.toDataURL('image/png');
        $('#voice').html('<img id="tempImage" src=""/>');
        $('#tempImage').attr('src', data);
        $('#canvasPic').eq(0).hide();
      }
    },
    savePhoto: function(aiData){
      console.log('test');
    },
    detectProfile: function(aiData){
      console.log('test');
    }
  }
}();