function RootCtrl($scope, Chart){
	$scope.user = {
		login : '',
		email : '',
		password : ''
	};
	$scope.loginSignupChange = function() {
		if($scope.signupForm.$valid){
			$scope.signupDisabled = '';
		}else{
			$scope.signupDisabled = 'disabled';
		}
	};
	$scope.submitSignup = function(){
		if($scope.signupForm.$valid){
			console.log($scope.user);
			$scope.alert.warning($scope.i18n.get('not.implemented'), '');
		}
	};
}

function ChartListCtrl($scope, Chart) {
	$scope.chartsType = Chart.query();
	$scope.orderProp = 'rank';
}

function ChartDetailListCtrl($scope, $routeParams, $http) {
  $http.get('data/' + $routeParams.chartId + '.json').success(function(data) {
    $scope.chartType = $routeParams.chartId;
    $scope.charts = data;
	$scope.orderProp = 'rank';
  }).error(function(data, status, headers, config) {
    var title = $scope.i18n.get('error') + ' ' + status;
	if(status == '404'){
		$scope.alert.error(title, $scope.i18n.get('http.404'));
	}else{
		$scope.alert.error(title, data);
	}
  });
}

function ChartScatterShowCtrl($rootScope, $scope, $routeParams, $http){
	$http.get('data/scatters/' + $routeParams.id + '.json').success(function(data) {
		$scope.chart = data;
		var chart = new Chart();
		chart.scatter(data);
		setTimeout(function(){
			$('.datetime').datepicker({
					format : 'mm-dd-yyyy'
			});
			window.prettyPrint && prettyPrint();
		}, 500);
		
		$scope.submitJobs = function(){
			$('#btn-submit-jobs').button('loading');
			var jobs = new Jobs($rootScope.trakerService);
			jobs.send($scope, $http);
			jobs.receive($scope, $http, function(data, achievedPorcent, time){
				for(var index in data){
					var responses = data[index].data;
					if(!$.isArray(responses)){
						responses = [responses];
					}
					for(var i in responses){
						var response = responses[i];
						chart.object.series[0].addPoint([parseInt(response.x), parseFloat(response.y[0].value)], false);
						chart.object.series[1].addPoint([parseInt(response.x), parseFloat(response.y[1].value)], false);
						chart.object.series[2].addPoint([parseInt(response.x), parseFloat(response.y[2].value)], false);
						$scope.map.addMarker($scope.map.ICON_GREEN, data[index].coordinates.lat, data[index].coordinates.lon, data[index].requestedby, '');
					}
				}
				$('#loading-bar').width(achievedPorcent + '%');
				$('#btn-submit-jobs').text(achievedPorcent + "%, " + time + "s");
				chart.object.redraw();
				if(achievedPorcent >= 100){
					$rootScope.trakerService.requestCompleted(time);
				}
			});
			return false;
		};
	});
}
function ChartScatterEditCtrl($scope, $routeParams, $http){
	if($routeParams.id > 0){
		$http.get('data/scatters/' + $routeParams.id + '.json').success(function(data) {
			$scope.chart = data;
		});
	}
}