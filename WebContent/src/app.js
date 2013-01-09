angular.module('BigDataAnalytics', ['chartTypeServices', 'i18nServices', 'i18nFilter'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {templateUrl: 'src/templates/index.html', controller: IndexCtrl}).
			when('/charts', {templateUrl: 'src/templates/chart-list.html', controller: ChartListCtrl}).
			when('/charts/:chartId', {templateUrl: 'src/templates/chart-detail-list.html', controller: ChartDetailListCtrl}).
			when('/charts/scatters/show/:id', {templateUrl: 'src/templates/chart-scatter-show.html', controller: ChartScatterShowCtrl}).
			when('/charts/scatters/edit/:id', {templateUrl: 'src/templates/chart-scatter-edit.html', controller: ChartScatterEditCtrl}).
			otherwise({redirectTo: '/'});
}]);