function AlertBox() {
	function template(type, title, msg){
		var $alert = $('<div></div>').addClass('offset4 span4 alert alert-block alert-' + type).append(
			$('<button></button>').addClass('close').attr({
				'type': 'button',
				'data-dismiss': 'alert'
			}).text('×')
		).append(
			$('<b></b>').text(title + '!')
		).append(
			$('<p></p>').html(msg)
		)
		$('#alert').addClass('row-fluid').html('').append($alert);
		setTimeout(function(){
			$alert.fadeOut(1000, function(){
				$(this).remove();
			});
		},5000);
	}
	this.info = function(title, msg){
		template('info', title, msg);
	}
	this.success = function(title, msg){
		template('success', title, msg);
	}
	this.warning = function(title, msg){
		template('warning', title, msg);
	}
	this.error = function(title, msg){
		template('error', title, msg);
	}
}