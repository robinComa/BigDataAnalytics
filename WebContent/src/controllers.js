function IndexCtrl($scope, Chart){
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
	}
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

function ChartScatterShowCtrl($scope, $routeParams, $http){
	$http.get('data/scatters/' + $routeParams.id + '.json').success(function(data) {
		$scope.chart = data;
		var chart = new Chart();
		chart.scatter(data);
		setTimeout(function(){
			$('.datetime').datepicker();
			window.prettyPrint && prettyPrint();
		}, 500);
		
		$scope.submitJobs = function(){
			var jobs = new Jobs($scope, $http);
			jobs.send();
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