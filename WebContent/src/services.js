angular.module('chartTypeServices', ['ngResource']).factory('Chart', function($resource){
	return $resource('data/:chartId.json', {}, {
		query: {method:'GET', params:{chartId:'charts'}, isArray:true}
	});
});

angular.module('i18nService', ['ngResource']).factory('I18n', function($resource){
	return $resource('i18n/:lang.json', {lang:'@lang'});
});

angular.module('trackingService', ['ng']).service('Tracker', ['$rootScope', '$window', '$location', function($rootScope, $window, $location) {
	  
	$window._gaq = $window._gaq || [];
	$window._gaq.push(['_setAccount', 'UA-37618084-1']);
	$window._gaq.push(['_trackPageview', $location.path()]);
	
	var trackingScope = {
		VISITOR : 1,
		SESSION : 2,
		PAGE : 3
	};

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
		
    $rootScope.$on('$viewContentLoaded', function() {
    	$window._gaq.push(['_trackPageview', $location.path()]);
    });
    
    this.connected = function(boolean){
    	var user = 'ANONYMOUS';
    	if(boolean){
    		user = 'CONNECTED';
    	}
    	$window._gaq.push(['_setCustomVar', 1, 'user', user, trackingScope.VISITOR]);
    };
        
    this.requestStarted = function(nbJobs){
    	$window._gaq.push(['_setCustomVar', 2, 'requestStarted', nbJobs, trackingScope.VISITOR]);
    };
    
    this.requestCompleted = function(time){
    	$window._gaq.push(['_setCustomVar', 3, 'requestCompleted', time, trackingScope.VISITOR]);
    };
    
    this.jobCompleted = function(status){
    	$window._gaq.push(['_setCustomVar', 4, 'jobCompleted', status, trackingScope.VISITOR]);
    };
  }
]);