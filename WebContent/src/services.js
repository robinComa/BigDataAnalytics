angular.module('chartTypeServices', ['ngResource']).factory('Chart', function($resource){
	return $resource('data/:chartId.json', {}, {
		query: {method:'GET', params:{chartId:'charts'}, isArray:true}
	});
});
angular.module('i18nServices', ['ngResource']).factory('I18n', function($resource){
	return $resource('i18n/:lang.json', {lang:'@lang'});
});