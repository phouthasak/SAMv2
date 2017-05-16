//have to make it syncronous or else it will interfere with stocks.js
$.getJSON({
	type: 'GET',
	dataType: "json",
	async: false,
	url: '/weather',
	success: function(data){
		wrapperSetup(data);
	}
});

function wrapperSetup(weatherdata){
	$('#weather').html(`<div id="temp"></div>
		<div id="location"></div>
		<div id="wind"><i class="wi"></i></div>
		<div id="forecast">
			<div class="row">
				<div class="col">
					<div id="day0">
						<div id="day"></div>
						<div id="high"></div>
						<div id="skyIcon"></div>
						<div id="low"></div>
					</div>
				</div>
				<div class="col">
					<div id="day1">
						<div id="day"></div>
						<div id="high"></div>
						<div id="skyIcon"></div>
						<div id="low"></div>
					</div>
				</div>
				<div class="col">
					<div id="day2">
						<div id="day"></div>
						<div id="high"></div>
						<div id="skyIcon"></div>
						<div id="low"></div>
					</div>
				</div>
				<div class="col">
					<div id="day3">
						<div id="day"></div>
						<div id="high"></div>
						<div id="skyIcon"></div>
						<div id="low"></div>
					</div>
				</div>
			</div>
		</div>`);
		addWidget(weatherdata);
		setInterval('updateWeather()', 600000);
}

function addWidget(weather){
	var date = new Date();
	var dayOfWeek = ["Sun","Mon", "Tues", "Wed","Thur", "Fri", "Sat"];
	var todayDayIndex =  date.getDay();
	var temp = 0;

	$('#weather #temp').html(Math.ceil(parseInt(weather.today.temperature)) + "&deg;F");
	$('#weather #location').html("Toledo, OH");
	$('#weather #wind').html(weather.today.weatherDescription);
	$('#weather #wind').prepend("<i class='wi wi-forecast-io-"+weather.today.icon+"'></i>");

	for (var i = 0; i < 4; i++) {
		var dayTag = "#day" + i;
		$('#forecast ' + dayTag + ' #day').html(weather.forecast[i].shortday);
		$('#forecast ' + dayTag + ' #high').html(Math.ceil(parseInt(weather.forecast[i].high)));
		$('#forecast ' + dayTag + ' #skyIcon').html("<i class='wi wi-forecast-io-"+weather.forecast[i].icon+"'></i>");
		$('#forecast ' + dayTag + ' #low').html(Math.ceil(parseInt(weather.forecast[i].low)));
		if((todayDayIndex + i) > 6){
			$('#forecast ' + dayTag + ' #day').html(dayOfWeek[temp]);
			temp++;
		}else{
			$('#forecast ' + dayTag + ' #day').html(dayOfWeek[todayDayIndex + i]);
		}
	}

}

function updateWeather() {
    $.getJSON({
        type: 'GET',
        dataType: "json",
        async: false,
        url: '/weather',
        success: function(data) {
            addWidget(data);
            console.log("Weather updated");
        }
    });
}
