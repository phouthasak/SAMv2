var entries = [];
var color = {
    "aries": "red-text text-lighten-1",
    "taurus": "green-text",
    "gemini": "yellow-text",
    "cancer": "blue-grey-text text-lighten-1",
    "leo": "orange-text",
    "virgo": "indigo-text text-lighten-2",
    "libra": "pink-text text-accent-2",
    "scorpio": "red-text text-accent-4",
    "sagittarius": "purple-text text-lighten-1",
    "capricorn": "brown-text",
    "aquarius": "blue-text text-darken-1",
    "pisces": "teal-text text-accent-2"
}
$.getJSON({
    type: 'GET',
    dataType: "json",
    async: false,
    url: '/horoscope',
    success: function(data){
        $.each(data.entries, function(i){
            entries[i] = data.entries[i];
        });

        addHoroscopeWidget(entries);
    }
});

function addHoroscopeWidget(entries) {
    console.log(entries);
  var i = 0;
  $('#horoscope').append('<div class="hSign"></div><div class="hText"></div>');
  $('#horoscope .hSign').html(entries[i].sunsign.trim().toString().toUpperCase()).addClass(color[entries[i].sunsign]);
  $('#horoscope .hText').html(entries[i].horoscope.toString().replace(/\['/g, '').trim());
  $('#horoscope .hText').fadeIn(250);


  setInterval(function() {
    $('#horoscope').fadeOut(250).promise().done(function(){
        $('#horoscope .hSign').removeClass(color[entries[i].sunsign]);
      if (i < entries.length - 1) { i++; } else { i = 0; }
      $('#horoscope .hSign').addClass(color[entries[i].sunsign]);
      $('#horoscope .hSign').html(entries[i].sunsign.trim().toString().toUpperCase());
      $('#horoscope .hText').html(entries[i].horoscope.toString().replace(/\['/g, '').trim());
      $('#horoscope').fadeIn(250);
    });
  }, 10000);
}
