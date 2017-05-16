var options = [
  {"script":"news", "name":"News"},
  {"script":"weather", "name":"Weather"},
  {"script":"stocks", "name":"Stocks"},
  {"script":"today", "name":"Clock and Date"},
  {"script":"welcome", "name":"Welcome Message"},
  {"script":"ootd", "name":"Outfit of the Day"},
  {"script":"voice", "name": "Voice Recognition (feedback area)"},
  {"script":"horoscope", "name": "Horoscope"}
];

var config;

function initselect() {
  $('select').material_select();
}

$(document).ready(function() {
  for (var option in options) {
    $('select').append('<option value="'+ options[option].script +'">'+ options[option].name +'</option>');
  }

  $.get('/config', function(data) {
    for (var x=1; x < 9; x++) {
      var widget = data['spots']['spot'+x]['module'];
      $('#spot'+x+' option[value="'+widget+'"]').attr('selected','selected');
    }
    $('#darkskyapi').val(data['darkskyApiKey']);
    $('#weatherCoordinates').val(data['weatherCoordinates'].join());
    $('#newsapi').val(data['newsApiKey']);
    $('#youtubeapi').val(data['youtubeApiKey']);
    $('#flickrapi').val(data['flickrApiKey']);
    $('#flickrsecret').val(data['flickrSecret']);
    $('#stockslist').val(data['stocksList'].join());
    $('#horoscopelist').val(data['horoscopeSigns'].join());
    initselect();
  });

  $('#saveconfig').click(function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to save? *Config file will be overwritten*')) {
      $.post('/config', {
          darkskyApiKey: $('#darkskyapi').val(),
          newsApiKey: $('#newsapi').val(),
          youtubeApiKey: $('#youtubeapi').val(),
          flickrApiKey: $('#flickrapi').val(),
          flickrSecret: $('#flickrsecret').val(),
          stocksList: $('#stockslist').val().split(","),
          weatherCoordinates: $('#weatherCoordinates').val().split(","),
          horoscopeSigns: $('#horoscopelist').val().split(","),
          spot1: $('#spot1').val(), spot2: $('#spot2').val(), spot3: $('#spot3').val(), spot4: $('#spot4').val(),
          spot5: $('#spot5').val(), spot6: $('#spot6').val(), spot7: $('#spot7').val(), spot8: $('#spot8').val()
        },
        function(data) {
          alert(data);
        }
      );
    }
  });


});
