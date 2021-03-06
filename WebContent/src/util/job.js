function Jobs(tracker){

	var RESOURCE = 'job';
	
	this.send = function($scope, $http){

		var delta = parseInt($scope.chart.data.worker.nbx);
		var coef = 1;
		var min,max;
		if($scope.chart.data.x.type == 'datetime'){
			coef = 1000 * 60 * 60 * 24;//1 delta == 1 day
			delta = coef * delta;
			min = new Date($scope.chart.data.x.min);
			min = min.getTime();
			max = new Date($scope.chart.data.x.max);
			max = max.getTime();
		}else{
			min = parseInt($scope.chart.data.x.min);
			max = parseInt($scope.chart.data.x.max);
		}

		//this.jobPorcent = Math.ceil(((max / coef) - (min / coef)) / parseInt($scope.chart.data.worker.nbx));
		var jobs = [];
		this.jobsIdToReceive = [];
		while (min < max){
			var id = parseInt([$scope.config.user.id,$scope.config.user.countId++].join(''));
			this.jobsIdToReceive.push(id);
			jobs.push({
				id : id,
				service: $('#services').val(),
				script: $scope.chart.script,
				x: {
					min : min,
					max : (min + delta)
				},
				y: [],
				coordinates: $scope.config.user.coordinates,
				requestedby : $scope.config.user.username
			});
			min = min + delta;
		}
		this.nbJobs = jobs.length;
		this.start = new Date();
		var nbJobs = this.nbJobs;
		this.jobAchieved = 0;
		$scope.alert.info($scope.i18n.get('request.sending'), $scope.i18n.get('request.jobs', [nbJobs]));

		$http.post([$scope.config.urls.jobstack,RESOURCE,$scope.config.user.id,$scope.config.user.token,'request','collection'].join('/'), JSON.stringify({jobRequest: jobs})).success(function(response){
			$scope.alert.success($scope.i18n.get('request.was.send', [nbJobs]), '');
			tracker.requestStarted(nbJobs);
		}).error(function(data, status, headers, config){
			var title = $scope.i18n.get('error')  + ' ' + status;
			if(status == '404'){
				$scope.alert.error(title, $scope.i18n.get('http.404'));
			}else{
				$scope.alert.error(title, '');
			}
		});
	};
	
	this.receive = function($scope, $http, callback){
		var jobObj = this;
		var dataReceiveInterval = setInterval(function(){
			$http.get([$scope.config.urls.jobstack,RESOURCE,$scope.config.user.id, $scope.config.user.token,'response'].join('/')).success(function(data) {
				if(data && data != 'null' && data.jobResponse){
					var results = data.jobResponse;
					if(!$.isArray(data.jobResponse)){
						jobObj.achieved++;
						results = [data.jobResponse];
					}
					
					/** Remove results already cached */
					for(var i in results){
						var index = jobObj.jobsIdToReceive.indexOf(parseInt(results[i].id));
						if(index == -1){
							//remove this result
							results.splice(i, 1);
							console.log('Job already cached!');
						}else{
							//remove job id of the temporary waiting jobs queue
							jobObj.jobsIdToReceive.splice(index, 1);
						}
					}

					jobObj.jobAchieved += results.length;
					var porcentAchived = ((jobObj.jobAchieved / jobObj.nbJobs) * 100).toFixed(1);
					var now = new Date();
					var time = now.getTime() - jobObj.start.getTime();
					if(porcentAchived >= 100){
						clearInterval(dataReceiveInterval);
					}
					callback(results, porcentAchived, (time / 1000).toFixed(0));
				}	
			});
		}, 1000 * 15);
	};

	this.work = function($scope, $http){
		
		var BLANK_DELAY = 10 * 1000;
		var DELAY = 5 * 1000;
		$scope.worker = {};
		
		/** Worker event */
		function onError(e) {
			$scope.alert.error($scope.i18n.get('worker.error'), ['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''));
			tracker.jobCompleted('JOB_ERROR_IN_WORKER');
		}

		function onMsg(e) {
						
			/** Push computing results */
			Worker.prototype.terminate.call($scope.worker.oWorker);
			$scope.worker.oWorker = false;
			$http.put([$scope.config.urls.jobstack,RESOURCE,$scope.config.user.id,$scope.config.user.token,'response',$scope.worker.request.id].join('/'),{
				id : $scope.worker.request.id,
				computedby : $scope.worker.request.requestedby,
				datetime : $scope.worker.request.datetime,
				coordinates : $scope.config.user.coordinates,
				computedby : $scope.config.user.login,
				data : e.data
			}).success(function(){
				tracker.jobCompleted('JOB_COMPLETED');
			}).error(function(data, status, headers, config){
				$scope.alert.error($scope.i18n.get('worker.error'), $scope.i18n.get('worker.send.response.error'));
				tracker.jobCompleted('JOB_ERROR_SEND_RESULTS');
			});
			setTimeout(function(){
				startWorker();
			}, DELAY);
		}
		/** END Worker Event */

		/** Get jobs */
		function startWorker(){
			$.ajax({
				url : [$scope.config.urls.jobstack,RESOURCE,$scope.config.user.id, $scope.config.user.token,'request','oldest'].join('/'),
				type : 'GET',
				dataType : "json",
				contentType : 'application/json',
				success : function(req){
					/** Any Jobs ? */
					if(req){
						var strScript = 'self.onmessage=function(oEvent){postMessage(main(oEvent.data));};' + req.script;
						var oblob = new Blob([strScript], { "type" : "text\/javascript" });
						var domainScriptURL = URL.createObjectURL(oblob);
						domainScriptURL = 'data/mmmDay.js';
						
						$scope.map.addMarker($scope.map.ICON_YELLOW, req.coordinates.lat, req.coordinates.lon, req.requestedby, '');
						$scope.worker.request = req;
						
						$scope.worker.oWorker = new Worker(domainScriptURL);
						$scope.worker.oWorker.addEventListener('message', onMsg, false);
						$scope.worker.oWorker.addEventListener('error', onError, false);

						//TODO data.attr in job configuration
						$.ajax({
							url : [req.service,req.x.min,req.x.max].join('/'),
							type : 'GET',
							dataType : 'jsonp',
							jsonp : 'callback',
							data : {
								attr : 'vd'
							},
							success : function(data){
								data.min = req.x.min;
								data.max = req.x.max;
								$scope.worker.oWorker.postMessage(data);
							},error : function(){
								tracker.jobCompleted('JOB_ERROR_GET_DATA');
								setTimeout(function(){
									startWorker();
								}, BLANK_DELAY);
							}
						});
					}else{
						setTimeout(function(){
							startWorker();
						}, BLANK_DELAY);
					}
				},
				error : function(){
					setTimeout(function(){
						startWorker();
					}, BLANK_DELAY);
				}
			});
		}

		if (window.Worker) {
			startWorker();
		} else {
			$scope.alert.warning($scope.i18n.get('html5.error'), 'Web worker');
		}
		/** END Get jobs */
	};

}