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

	/** Push Simulation */
	/**

	setInterval(function() {
		var contryTemplate = [{
			lon : "30...50:8",
			lat : "-120...-70:8"
		}, {
			lon : "10...30:8",
			lat : "70...84:8"
		}, {
			lon : "40...55:8",
			lat : "-4...20:8"
		}, {
			lon : "-12...-35:8",
			lat : "110...150:8"
		}];
		var dataModelShuffleTemplate = {
			id : "0...1000000",
			computedby : ["Robin", "John", "Bill", "Elton", null],
			coordinates : function() {
				return DataFixture.generate(contryTemplate, 0)[DataFixture.getRandom(0, 3)];
			},
			x : function() {
				var ramdom = DataFixture.getRandom(6942204, 13253724) * 100000;
				return ramdom - (ramdom % (1000 * 60 * 60 * 24));
			},
			min : "0...6:2",
			mean : "30...36:2",
			max : "60...66:2"
		};
		var pushShuffleTemplate = {
			nbData : "0...9"
		};
		var nbData = DataFixture.generate(pushShuffleTemplate, 0).nbData;
		_.each(new LinearListModel(DataFixture.generate(dataModelShuffleTemplate, nbData)).models, function(data) {
			controller.trigger("dataReceive", data);
		});
	}, 5000);
	*/
	/** END OF Push Simulation  */

});

