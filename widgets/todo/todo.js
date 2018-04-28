var todoWidget = function(){
	return {
		getData: function(){
			$.getJSON({
				type: 'GET',
				dataType: "json",
				async: true,
				url: '/todo',
				success: function(data){
					todoWidget.wrapperSetup(data);
				}
			});
		},
		wrapperSetup: function (todoList){
			$('#todo').before('<div id="todoHeader"><strong>Todo List:</strong></div>');
			$('#todo').html('<ol id="todoList"></ul>');
			todoWidget.addWidget(todoList);
		},
		addWidget: function(todoList){
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
			todoWidget.divScrollDown();
		},
		divScrollDown: function(){
			var $stocksDiv = $('#todo');
			$stocksDiv.animate({
				scrollTop: $stocksDiv.get(0).scrollHeight
			}, 5000, function(){
				todoWidget.divScrollUp();
			});
		},
		divScrollUp: function (){
			var $stocksDiv = $('#todo');
			$stocksDiv.animate({
				scrollTop: 0
			}, 5000, function(){
				todoWidget.divScrollDown();
			});
		}
	}
}();

todoWidget.getData();