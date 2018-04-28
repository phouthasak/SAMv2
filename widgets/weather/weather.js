var weatherWidget = function(){
	var weatherData = {};
	return {
		setWeatherData: function(data){
			weatherWidget.weatherData = data;
		},
		getData: function(){
			$.getJSON({
			type: 'GET',
			dataType: "json",
			async: true,
			url: '/weather',
			success: function(data){
					weatherWidget.setWeatherData(data);
					weatherWidget.wrapperSetup();
				}
			});
		},
		wrapperSetup: function(){
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
			weatherWidget.addWidget(weatherWidget.weatherData);
			setInterval('weatherWidget.updateWeather()', 600000);
		},
		addWidget: function(weather){
			var date = new Date();
			var dayOfWeek = ["Sun","Mon", "Tues", "Wed","Thur", "Fri", "Sat"];
			var todayDayIndex =  date.getDay();
			var temp = 0;
			$('#weather #temp').html(Math.ceil(parseInt(weather.today.temperature)) + "&deg;F");
			$('#weather #location').html("Lewis Center, OH");
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
		},
		updateWeather: function() {
		    $.getJSON({
		        type: 'GET',
		        dataType: "json",
		        async: true,
		        url: '/weather',
		        success: function(data) {
		        	weatherWidget.setWeatherData(data);
		        	weatherWidget.addWidget(weatherWidget.weatherData);
		            console.log("Weather updated");
		        }
		    });
		}
	}
}();

weatherWidget.getData();