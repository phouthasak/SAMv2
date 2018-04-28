var todayWidget = function(){
	var monthNames = ["Jan.", "Feb.", "Mar.",
    "Apr.", "May", "June", "July",
    "Aug.", "Sept.", "Oct.",
    "Nov.", "Dec."
	];

	var dayOfWeek = ["Sun","Mon", "Tues", "Wed",
	"Thur", "Fri", "Sat"
	];

	return {
		wrapperSetup: function(){
			$('#today').html('<div id="clock"></div><div id="date"></div>');
		},
		renderClock: function(){
			var currentTime = new Date();
			var period = "AM";
			var hour = currentTime.getHours();
			var min = currentTime.getMinutes();
			var seconds = currentTime.getSeconds();

			if(hour == 0){
				hour = 12;
			}else if(hour > 12){
				hour = hour - 12
				period = "PM"
			}

			if(hour < 10){
				hour = "0" + hour;
			}

			if(min < 10){
				min = "0" + min;
			}

			if(seconds < 10){
				seconds = "0" + seconds;
			}

			$('#clock').html(hour + ":" + min + "<span id='seconds'>" + seconds + "</span><span id='ampm'>" + period + "</span>");
			setTimeout('todayWidget.renderClock()', 1000);
		},
		renderDate: function(){
			todayWidget.updateDate();
			setInterval('todayWidget.updateDate()', 600000);
		},
		updateDate: function(){
			var date = new Date();
			var dayNumber = date.getDate();
			var monthIndex = date.getMonth();
			var year = date.getFullYear();
			var dayIndex = date.getDay();

			$('#date').html(dayOfWeek[dayIndex] + ", " + monthNames[monthIndex] + " " + dayNumber + ", " + year);
			console.log("Date updated");
		}
	}
}();

todayWidget.wrapperSetup();
todayWidget.renderClock();
todayWidget.renderDate();
