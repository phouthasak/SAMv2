//have to make it syncronus or else it'll interfere with other widgets
$.getJSON({
	type: 'GET',
	dataType: "json",
	async: false,
	url: '/todo',
	success: function(data){
		wrapperSetup(data);
	}
});

function wrapperSetup(todoList){
	$('#todo').before('<div id="todoHeader"><strong>Todo List:</strong></div>');
	$('#todo').html('<ol id="todoList"></ul>');
	addWidget(todoList);
}

function addWidget(todoList){
	var indexCounter = 0;
	var $todoList = $('#todoList');
    for (var item in todoList) {
    	if(todoList[item].done){
    		$todoList.append(`<li>
				<div id="task" class="red-text"><strong>`+todoList[item].task+`</strong></div>
			</li>`);
    	}else{
    		$todoList.append(`<li>
				<div id="task"><strong>`+todoList[item].task+`</strong></div>
			</li>`);	
    	}
	}
	divScrollDown();
}

function divScrollDown(){
	var $stocksDiv = $('#todo');
	$stocksDiv.animate({
		scrollTop: $stocksDiv.get(0).scrollHeight
	}, 5000, function(){
		divScrollUp();
	});
}

function divScrollUp(){
	var $stocksDiv = $('#todo');
	$stocksDiv.animate({
		scrollTop: 0
	}, 5000, function(){
		divScrollDown();
	});
}
