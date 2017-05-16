var heavyWeather = [
  "A heavy coat would do nicely today.",
  "Pullover, winter hat, gloves, scarf, and heavy coat.",
  "It's pretty cold today, might want a heavy jacket."
];

var meduimWeather = [
  "A light jacket would be great for today.",
  "A sweater would be sufficient.",
  "A hoodie would do nicely for this kind of weather."
];

var lightWeather = [
  "Sun's out, guns out!",
  "Wear your favorite T-Shirt and enjoy the weather!",
  "Something light would be a great fit for this weather."
];

var extremeWeather = [
  "Don't even go outside!",
  "A blanket! BURRRRRRR.",
  "Baby it's cold, out, sidddddeeeeee!"
];

var rainWeather = [
  "Don't forget the Umbrella.",
  "There is a chance for rain, don't forget an umbrella.",
  "Rain coat and rain boots would be nice!"
];

//var rainCode = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18, 35, 37, 38, 39, 40, 45, 47];

$.getJSON({
	type: 'GET',
	dataType: "json",
	async: false,
	url: '/weather',
	success: function(data){
		wrapperSetup(data);
	}
});

function wrapperSetup(weatherData) {
    $('#ootd').html('<div id="ootdHeader"><strong>OOTD</strong></div><div id="ootdPrompt"></div>');
    addWidget(weatherData);
    setInterval('updateOOTD()', 600000);
}


function addWidget(weatherData) {
    var currentTemp = parseInt(weatherData.today.temperature);
    var precipProb = parseFloat(weatherData.today.chanceOfRain);
    var precipType = weatherData.today.precipType;
    var windspeed = parseFloat(weatherData.today.windspeed);
    console.log(precipProb);
    var rand;
    var rand2 = Math.floor(Math.random() * rainWeather.length);

    if (currentTemp < 45 && currentTemp > 0) {
        rand = Math.floor(Math.random() * heavyWeather.length);
        $('#ootdPrompt').html(heavyWeather[rand]);
    } else if (currentTemp >= 45 && currentTemp <= 60) {
        rand = Math.floor(Math.random() * meduimWeather.length);
        $('#ootdPrompt').html(meduimWeather[rand]);
    } else if (currentTemp > 60) {
        rand = Math.floor(Math.random() * lightWeather.length);
        $('#ootdPrompt').html(lightWeather[rand]);
    } else {
        rand = Math.floor(Math.random() * extremeWeather.length);
        $('#ootdPrompt').html(extremeWeather[rand]);
    }

    if (precipProb > 0.5 && precipType == 'rain') {
        $('#ootdPrompt').append("<br>" + rainWeather[rand2]);
        console.log(true);
    }
}

function updateOOTD() {
    $.getJSON({
        type: 'GET',
        dataType: "json",
        async: false,
        url: '/weather',
        success: function(data) {
          addWidget(data);
          console.log("OOTD updated");
        }
    });
}