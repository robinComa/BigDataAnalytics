angular.module('BigDataAnalytics', ['chartTypeServices', 'i18nService', 'i18nFilter', 'trackingService'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {templateUrl: 'src/templates/root.html', controller: RootCtrl}).
			when('/charts', {templateUrl: 'src/templates/chart-list.html', controller: ChartListCtrl}).
			when('/charts/:chartId', {templateUrl: 'src/templates/chart-detail-list.html', controller: ChartDetailListCtrl}).
			when('/charts/scatters/show/:id', {templateUrl: 'src/templates/chart-scatter-show.html', controller: ChartScatterShowCtrl}).
			when('/charts/scatters/edit/:id', {templateUrl: 'src/templates/chart-scatter-edit.html', controller: ChartScatterEditCtrl}).
			otherwise({redirectTo: '/'});
}]);