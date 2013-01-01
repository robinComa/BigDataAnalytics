var controller = {};

_.extend(controller, Backbone.Events);

controller.on("chartRequest", function(JobRequestListModel) {

	/** UI */
	//TODO UI in view '<button class="close" id="chart-remove">×</button>'
	$('#chart-container').append(
			$('<button></button>').addClass('close').text('×').click(function() {
				controller.off("dataReceive");
				$('#chart-container').html('');
				$('#loading-bar').width('0%');
				$('#btn-submit').button('reset').attr('data-done', '0');
			})
	).append(
			$('<div></div>').attr('id', 'chart')
	);
	$('#btn-submit').button('loading');

	/** Send requests to the server */
	JobRequestListModel.save();

	chartLine();
	
	/** Open tabs for processing */
	window.open([window.config.url.analysis,'processing.html'].join('/'));

	/** Get Jobs response */
	var jobsResponseListner = setInterval(function(){
		$.ajax({
			url : [window.config.url.webService,'job',window.config.user.id, window.config.user.token,'response'].join('/'),
			type : 'GET',
			contentType : 'application/json',
			success: function(json){
				if(json){
					if($.isArray(json.jobResponse)){
						_.each(json.jobResponse, function(data) {
							_.defer(function(){
								controller.trigger("dataReceive", new LinearModel(data));
							});
						});
					}else{
						controller.trigger("dataReceive", new LinearModel(json.jobResponse));
					}
					setTimeout(function(){
						window.chart.redraw();
					}, 100);
				}				 
			}
		});
	}, 1000 * 15);

	controller.on("dataReceive", function(data) {
		var $dataRow = $('#data-row');
		while ($dataRow.find('.data-row').size() > 20) {
			$dataRow.find('.data-row').last().remove();
		}
		var view = new DataView({
			model : data,
			id : "document-row-" + data.id
		});
		view.render().prependTo('#data-row');

		var current = parseInt($('#btn-submit').attr('data-done'));
		var total = parseInt($('#btn-submit').attr('data-total'));
		current++;
		var porcent = ((current / total) * 100).toFixed(2);
		if(current == total){
			$('#loading-bar').width('100%');
			$('#btn-submit').val('100%');
		}else{
			$('#loading-bar').width(porcent + "%");
			$('#btn-submit').val(porcent + "%");
			$('#btn-submit').attr('data-done', current);
		}

		if (data.isValid()) {
			//TODO generique
			window.chart.series[0].addPoint([data.attributes.x, data.attributes.min], false);
			window.chart.series[1].addPoint([data.attributes.x, data.attributes.max], false);
			window.chart.series[2].addPoint([data.attributes.x, data.attributes.mean], false);
			
			/** Remove request */
			//TODO remove JobRequestListModel.get(data.id).destroy();
		} else {
			$(view.el).removeClass('alert-success');
		}
		try {
			var marker = new google.maps.Marker({
				map : map,
				animation : google.maps.Animation.DROP,
				position : new google.maps.LatLng(data.attributes.coordinates.lon, data.attributes.coordinates.lat)
			});
			var infowindow = new google.maps.InfoWindow({
				content : view.el
			});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map, marker);
			});
			setTimeout(function() {
				marker.setMap(null);
			}, 60000);
		} catch(ex) {
			console.error('Google map Exception : ' + ex);
		}
		
		if(porcent >= 100){
			clearInterval(jobsResponseListner);
			controller.off("dataReceive");
		}
	});
});
controller.on("chartRemove", function() {
	controller.off("dataReceive");
});
