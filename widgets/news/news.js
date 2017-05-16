var headlines = [];
var limit = 5;

$.get('/news', function(response){
  $.each(response.articles, function(i){
    headlines[i] = response.articles[i];
  });

  addNewsWidget(headlines);
});

function addNewsWidget(headlines) {
  var i = 0;
  $('#news').append('<div class="news-header"">Lastest in <strong>Google News<strong></div>');
  $('#news').append('<div class="news-item" style="display:none;"><div class="news-title"></div><div class="news-desc"></div></div>');
  $('#news .news-title').html(headlines[i].title);
  if (headlines[i].description !== 'null') {
    $('#news .news-desc').html(headlines[i].description);
  }
  $('#news .news-item').fadeIn(250);


  setInterval(function() {
    $('#news .news-item').fadeOut(250).promise().done(function(){
      if (i < headlines.length - 1) { i++; } else { i = 0; }
      $('#news .news-title').html(headlines[i].title);
      if (headlines[i].description !== null) {
        $('#news .news-desc').html(headlines[i].description);
      }
      $('#news .news-item').fadeIn(250);
    });
  }, 10000);
}
