function Jobs($scope, $http){
		
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
	
	var delayD = Math.ceil(((max / coef) - (min / coef)) / parseInt($scope.chart.data.worker.nbx));
	this.jobs = [];
	while (min < max){
		this.jobs.push({
			service: $('#services').val(),
			script: $scope.chart.script,
			x: {
				min : min,
				max : (min + delta)
			}
		});
		min = min + delta;
	}
		
	this.send = function(){
		$scope.alert.info($scope.i18n.get('request.sending'), $scope.i18n.get('request.jobs', [this.jobs.length]));
		
		$http.post($scope.urls.jobstack, this.jobs).success(function(response){
			$scope.alert.success($scope.i18n.get('request.was.send'), '');
		}).error(function(data, status, headers, config){
			var title = $scope.i18n.get('error')  + ' ' + status;
			if(status == '404'){
				$scope.alert.error(title, $scope.i18n.get('http.404'));
			}else{
				//$scope.alert.error(title, data);
			}
		});
	}	
	
}