$(document).ready(function() {
	/** Global support for the Big Data project */
	window.BD = {};

	/** Template Loading */
	$.get([window.config.url.analysis,'application/templates.html'].join('/'), function(templates) {
		$('body').append(templates);
	});

	/** Map */
	try {
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

	/** Worker event */
	function onError(e) {
		console.log(['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''));
	}

	function onMsg(e) {
		/** Push computing results to the client server (cross domain) */
		Worker.prototype.terminate.call(window.BD.oWorker);
		window.BD.oWorker = false;
		var response = new JobResponseModel();
		response.save({
			id : window.BD.request.id,
			requestedby : window.BD.request.requestedby,
			datetime : window.BD.request.datetime,
			coordinates : window.config.user.coordinates,
			computedby : window.config.user.login,
			x : window.BD.request.x.min,
			y : e.data
		}, '', {
			error : function(){
				console.log('send respnse error!');
				startWorker();
			}
		});
		startWorker();
	}
	/** END Worker Event */

	/** Get jobs */
	function startWorker(){
		$.ajax({
			url : [window.config.url.webService,'job',window.config.user.id, window.config.user.token,'request','oldest'].join('/'),
			type : 'GET',
			dataType : "json",
			contentType : 'application/json',
			success : function(req){
				/** Any Jobs ? */
				if(req){
					window.BD.request = req;
					var request = new JobRequestModel(req);
					window.BD.oWorker = new Worker(request.get('script'));
					window.BD.oWorker.addEventListener('message', onMsg, false);
					window.BD.oWorker.addEventListener('error', onError, false);
					var url = [request.get('service'),request.get('x').min,request.get('x').max].join('/');
					$.ajax({
						url : url,
						type : 'GET',
						dataType : 'jsonp',
					    jsonp : 'callback',
					    data : {
					    	attr : 'v'
					    },
						success : function(data){
							window.BD.oWorker.postMessage(data);
							console.log(new Date() + ' start worker ' + url);
						},error : function(){
							setTimeout(function(){
								startWorker();
							}, 1000 * 3);
						}
					});
				}else{
					setTimeout(function(){
						startWorker();
					}, 1000 * 3);
				}
			},
			error : function(){
				setTimeout(function(){
					startWorker();
				}, 1000 * 3);
			}
		});
	}

	if (window.Worker) {
		startWorker();
	} else {
		alert('Web worker are nor supported by your browser!');
	}
	/** END Get jobs */

});