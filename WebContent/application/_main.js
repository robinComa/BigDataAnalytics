$(document).ready(function() {

	/** Template Loading */
	$.get([window.config.url.analysis,'application/templates.html'].join('/'), function(templates) {
		$('body').append(templates);
	});

	try {
		/** Map */
		var mapOptions = {
			zoom : 1,
			center : new google.maps.LatLng(20, 0),
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		window.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	} catch(ex) {
		console.error('Google map Exception : ' + ex);
	}

	/** END OF Map */
	
	$('.datepicker').datepicker();

	$('#request').submit(function() {
		var delta = 1000 * 60 * 60 * 24 * parseInt($('#split').val());
		var start = new Date($('#start').val());
		var end = new Date($('#end').val());
		var delayD = Math.ceil(((end.getTime() / (1000*60*60*24)) - (start.getTime() / (1000*60*60*24))) / parseInt($('#split').val()));
		$('#btn-submit').attr('data-total', delayD);
		var jobRequestListModel = new JobRequestListModel();
		while (start < end){
			jobRequestListModel.add(
				new JobRequestModel({
					service: $('#service').val(),
					script: [window.config.url.analysis,'scripts','mmm-day.js'].join('/'),
					x: {
						min : start.getTime(),
						max : (start.getTime() + delta)
					},
					y: $('#y-value').val()
				})
			);
			start.setMilliseconds(start.getMilliseconds() + delta);
		}		
		controller.trigger('chartRequest', jobRequestListModel);
		return false;
		
	});

});

