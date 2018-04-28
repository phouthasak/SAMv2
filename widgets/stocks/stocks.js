var stockWidget = function(){
	return {
		getData: function(){
			$.getJSON({
				type: 'GET',
				dataType: "json",
				async: true,
				url: '/stocks',
				success: function(data){
					stockWidget.wrapperSetup(data);
				}
			});			
		},
		wrapperSetup: function(stockData){
			$('#stocks').before('<div id="stockHeader"><strong>Stocks</strong></div>');
			$('#stocks').html('<ul id="stockList"></ul>');
			stockWidget.addWidget(stockData);
		},
		addWidget: function (stocks){
			for(var i = 0; i < stocks.length; i++){
				var stockSymbol = stocks[i]['1. symbol'];
				var stockAsk = stocks[i]['2. price'];
				// var stockChange = stocks[i].Change;
				// var stockChangePercent = stocks[i].ChangeinPercent;

				$('#stockList').append(`<li id="`+stockSymbol+`">
					<div id="stockName">`+stockSymbol+`</div>
					<div id="stockPrice">$ `+parseFloat(stockAsk).toFixed(2)+`</div>
				</li>`);
			}
			stockWidget.divScrollDown();
			setInterval('stockWidget.updateStocks()', 60000);
		},
		updateStocks: function(){
			$.getJSON({
				type: 'GET',
				dataType: "json",
				url: '/stocks',
				async: true,
				success: function(data){
					for (var i = 0; i < data.length; i++) {
    					$('#' + data[0]['1. symbol']).find('#stockPrice').html('$ ' + parseFloat(data[i]['2. price']).toFixed(2));
    					// $('#' + data[0].symbol).find('#stockGain').html(data[i].Change + ' (' + data[i].ChangeinPercent + ')');
					}
					console.log("Stocks updated");
				}
			});
		},
		divScrollDown: function(){
			var $stocksDiv = $('#stocks');
			$stocksDiv.animate({
				scrollTop: $stocksDiv.get(0).scrollHeight
			}, 5000, function(){
						stockWidget.divScrollUp();
			});
		},
		divScrollUp: function(){
			var $stocksDiv = $('#stocks');
			$stocksDiv.animate({
				scrollTop: 0
			}, 5000, function(){
				stockWidget.divScrollDown();
			});
		}
	}
}();

stockWidget.getData();