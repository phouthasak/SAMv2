//required modules
var https = require('https');
var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");
var bodyParser = require('body-parser')
var os = require('os');
var ifaces = os.networkInterfaces();
var ip = require('ip');
var async = require('async');
var superagent = require('superagent');

var httpsOption = {
	cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
	key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
}

//node package for weather widget
var forecast = require('forecast');

//node package for voice youtube searching
var youtube = require('youtube-search');

//node package for voice picture searching from flickr
var Flickr = require('flickr-sdk');

//user variables
var config = require('./config.json');

//node package for API AI
var apiai = require('apiai');
var ApiAiAccessToken = config['apiaiApiKey'];
const apiaiApp = apiai(ApiAiAccessToken);

//allow JSON POST and GET variables
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/css", express.static(path.resolve(__dirname + "/css")));
app.use("/font", express.static(path.resolve(__dirname + "/font")));
app.use("/js", express.static(path.resolve(__dirname + "/js")));
app.use("/widgets", express.static(path.resolve(__dirname + "/widgets")));

app.get('/', function(req, res) {
	res.send(fs.readFileSync(path.resolve(__dirname + "/index.html"), {encoding: "utf8"}));
});

app.get('/settings', function(req, res) {
	res.send(fs.readFileSync(path.resolve(__dirname + "/settings.html"), {encoding: "utf8"}));
});

app.get('/pictures', function(req, res){
	var pictureQuery = req.query.subject;
	var flickr = new Flickr(config['flickrApiKey']);

	
	flickr.photos.search({text: pictureQuery, page: 1, per_page: 5, media: 'photos'})
		.then(function(response){
			res.send(response.body.photos.photo);
		}).catch(function(response){
			console.log(response);
		});
	// flickr.request().media().search(pictureQuery).get({page: 1, per_page: 5, media: 'photos'}).then(function (response) {
	// 	res.send(response.body.photos.photo);
	// });
});

app.get('/youtube', function(req,res){
  var videoQuery = req.query.subject;
  var apiKey = config['youtubeApiKey'];
  var opt = {
    maxResults: 5,
    type: 'video',
    key: apiKey
  }
  if(apiKey !== null){
  	youtube(videoQuery, opt, function(err, result){
      if(err) return console.log(err)

      res.send(result);
  	});
  }
});

app.get('/makeDir', function(req, res){
	var folderName = req.query.folderName;
	var workingDir = __dirname + "/widgets/profiles/" + folderName;
	if(!fs.existsSync(workingDir)){
		fs.mkdir(workingDir);
		res.send("Dir created");
	}else{
		res.send("Dir Exist");
	}
});

app.get('/commands', function(req, res){
	res.send(JSON.parse(fs.readFileSync('commands.json', 'utf8')));
});

app.get('/todo', function(req,res){
	res.send(JSON.parse(fs.readFileSync('todo.json', 'utf8')));
});

app.get('/weather', function(req, res) {
	var apiKey = config['darkskyApiKey'];
	var coor = config['weatherCoordinates'];
	var weather = new forecast({
		service: 'darksky',
		key: apiKey,
		units: 'fahrenheit',
		cached: false
	});
	
	weather.get(coor, true,function(err, result){
		if(err) console.log(err);
		var weatherObject = {
			"today": {
				"temperature": result.currently.temperature,
				"weatherDescription": result.currently.summary,
				"icon": result.currently.icon,
				"channceOfRain": result.currently.precipProbability,
				"precipType": result.currently.precipType,
				"windspeed": result.currently.windSpeed
			},
			"forecast":[
				{"day": result.daily.data[0].time,
				"high": result.daily.data[0].temperatureMax,
				"low": result.daily.data[0].temperatureMin,
				"icon":result.daily.data[0].icon,
				},{"day": result.daily.data[1].time,
				"high": result.daily.data[1].temperatureMax,
				"low": result.daily.data[1].temperatureMin,
				"icon":result.daily.data[1].icon,
				},{"day": result.daily.data[2].time,
				"high": result.daily.data[2].temperatureMax,
				"low": result.daily.data[2].temperatureMin,
				"icon":result.daily.data[2].icon,
				},{"day": result.daily.data[3].time,
				"high": result.daily.data[3].temperatureMax,
				"low": result.daily.data[3].temperatureMin,
				"icon":result.daily.data[3].icon,
				}
			]
		}
		res.send(weatherObject);
	});
});

app.get('/ai', function(req, res){
	var text = req.query.text;
	var aiText = "";
	console.log(text);
	
	ai = apiaiApp.textRequest(text, {
        sessionId: 'tabby_cat' // use any arbitrary id
    });

    ai.on('response', (response) => {
    	//response.result.fulfillment.action is the intents of the actions requested of the AI
        aiText = response.result.fulfillment.speech;
        parameters = response.result.parameters.title;
        test = response.result.action;
        console.log(aiText);
        console.log(test);
        console.log(parameters);
        res.send(response.result);

    });

    ai.on('error', (error) => {
        console.log(error);
    });

    ai.end();
});

app.get('/news', function(req, res) {
	var apiKey = config['newsApiKey'];
	var newsSource = config['newsSource'];
	var uri = "https://newsapi.org/v1/articles?source=" + newsSource +"&sortBy=top&apiKey=";
	if(apiKey !== null){
		superagent
		  	.get(uri + apiKey)
		  	.end(function (err, response){
		    // response is now cached, subsequent calls to this superagent request will now fetch the cached response
				res.send(response.body);
	  		}
		);
	}
});

//dead till I can find alternatives
/*app.get('/horoscope', function(req, res) {
	var signs = config['horoscopeSigns'];
	var uri = "http://horoscope-api.herokuapp.com/horoscope/today/"
	var horoscopeObject = {"entries":[]};
	var signsProcessed = 0;

	async.forEachOf(signs, function(value, key, callback) {
		superagent
		    .get(uri + value)
		    .end(function(err, response) {
		        horoscopeObject.entries.push(response.body);
		        callback();
		    });

	}, function(err) {
	    if (err) console.error(err.message);
	    res.send(horoscopeObject);
	})
});*/

app.get('/faceCompare', function(req, res) {
	var apiKey = config['facePlusPlusKey'];
	var apiSecret = config['facePlusPlusSecret'];
	
	var targetImage = fs.readFileSync(path.resolve(__dirname + "/widgets/profiles/phouthasak/target.jpg"));
	var refImage = fs.readFileSync(path.resolve(__dirname + "/widgets/profiles/phouthasak/ref.jpg"));
	var uri = "https://api-us.faceplusplus.com/facepp/v3/compare?" + "api_key=" + apiKey + "&api_secret=" + apiSecret;// + "&image_file1=image_file1&image_file2=image_file2";
	//var uri = "https://api-us.faceplusplus.com/facepp/v3/detect?" + "api_key=" + apiKey + "&api_secret=" + apiSecret;

	superagent
		.post(uri)
		.attach('image_file1', targetImage, 'target.jpg')
		.attach('image_file2', refImage, 'ref.jpg')
		.end(function(err, response){
			res.send(response);
		});
});

app.get('/stocks', function(req, res) {
// https://www.alphavantage.co/documentation/
	var stocksList = config['stocksList'];

	if(stocksList != null){
		var uri = "https://www.alphavantage.co/query?function=";
		var stocksObject = {"entries":[]};
		var queryFunction = "BATCH_STOCK_QUOTES";
		var stockUriList = "";

		for(var i = 0; i < stocksList.length; i++){
			if(i == stocksList.length - 1){
				stockUriList = stockUriList + stocksList[i];
			}else{
				stockUriList = stockUriList +stocksList[i] + ",";
			}
		}

		superagent
		  	.get(uri + queryFunction + "&symbols="+ stockUriList + "&apikey=" + config['alphaVantageApiKey'])
		  	.end(function (err, response){
				// console.log(uri + queryFunction + "&symbols="+ stockUriList + "&apikey=" + config['alphaVantageApiKey']);
				res.send(response.body['Stock Quotes']);
	  		}
		);
	}
});

app.get('/config', function(req, res) {
	config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
	res.send(JSON.parse(fs.readFileSync('config.json', 'utf8')));
});

app.post('/config', function(req, res) {
	var newconf = {};
	newconf.spots = {};
	newconf.darkskyApiKey = req.body.darkskyApiKey;
	newconf.newsApiKey = req.body.newsApiKey;
	newconf.youtubeApiKey = req.body.youtubeApiKey;
	newconf.flickrApiKey = req.body.flickrApiKey;
	newconf.flickrSecret = req.body.flickrSecret;
	newconf.stocksList = req.body.stocksList;
	newconf.weatherCoordinates = req.body.weatherCoordinates;
	newconf.horoscopeSigns = req.body.horoscopeSigns;
	newconf.spots.spot1 = {module: req.body.spot1, location: "spot1", script: "../widgets/"+req.body.spot1+"/"+req.body.spot1+".js"};
	newconf.spots.spot2 = {module: req.body.spot2, location: "spot2", script: "../widgets/"+req.body.spot2+"/"+req.body.spot2+".js"};
	newconf.spots.spot3 = {module: req.body.spot3, location: "spot3", script: "../widgets/"+req.body.spot3+"/"+req.body.spot3+".js"};
	newconf.spots.spot4 = {module: req.body.spot4, location: "spot4", script: "../widgets/"+req.body.spot4+"/"+req.body.spot4+".js"};
	newconf.spots.spot5 = {module: req.body.spot5, location: "spot5", script: "../widgets/"+req.body.spot5+"/"+req.body.spot5+".js"};
	newconf.spots.spot6 = {module: req.body.spot6, location: "spot6", script: "../widgets/"+req.body.spot6+"/"+req.body.spot6+".js"};
	newconf.spots.spot7 = {module: req.body.spot7, location: "spot7", script: "../widgets/"+req.body.spot7+"/"+req.body.spot7+".js"};
	newconf.spots.spot8 = {module: req.body.spot8, location: "spot8", script: "../widgets/"+req.body.spot8+"/"+req.body.spot8+".js"};
	console.log(newconf);
	fs.writeFile("config.json", JSON.stringify(newconf), function(err) {
    if(err) {
        res.send('Error! ' + err);
    }
    res.send('Configuration successfully saved!');
	});
});

app.post('/upload', function(req, res){
	res.send("Success");
});

app.get('/ip', function(req, res) {
	res.send(ip.address());
});

https.createServer(httpsOption, app).listen(8080, function() {
		console.log('Server running on port 8080!');
		console.log('Visit https://localhost:8080 to view.');
});