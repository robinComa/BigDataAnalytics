function BootstrapCtrl ($scope, $rootScope, $http, I18n) {

	var user = {
			id : '1234567890',
			username : 'Robin Coma',
			token : 'robinToken1234567890',
			countId : 1
	};
	
	var dev = {
			user : user,
			urls : {
				jobstack : 'http://localhost:8080/BigDataJobStack'
			}
	};
	var prod = {
			user : user,
			urls : {
				jobstack : 'http://jobstack.cloud-bigdata.com'
			}
	};
	
	$scope.config = dev;
	
	$scope.alert = new AlertBox();
	
	/**Langage detection*/
	var langage = (navigator.browserLanguage ? navigator.browserLanguage : navigator.language);	
	if (langage.indexOf('en') > -1) langage = 'en';
	else if (langage.indexOf('fr') > -1) langage = 'fr';
	else langage = 'en';
	
	/** i18n bootstrap */
	$rootScope.i18n = {
		dictionary : I18n.get({lang : langage}),
		get : function(input, args){
			if(!this.dictionary[input]){
				return input;
			}
			var string = this.dictionary[input];
			for(var i in args){
				string = string.replace(new RegExp('(\\{' + i + '\\})', "g"), args[i]);
			}
			return string;
		},
		changeLanguage : function (lang) {
			this.dictionary = I18n.get({lang : lang});
		}
	};

	/** Map bootstrap */
	$scope.map = new Map($scope);
	$scope.map.geolocation(function(coordinates){
		$scope.config.user.coordinates = {
				lat : coordinates.latitude,
				lon : coordinates.longitude
		};
		$scope.map.addMarker($scope.map.ICON_HOME, coordinates.latitude, coordinates.longitude, $scope.i18n.get('map.position.titre'), $scope.i18n.get('map.position.description'));
		/** Jobs worker bootstrap */
		var jobs = new Jobs();
		jobs.work($scope, $http);
	});
	
	$scope.loginFormChange = function() {
		if($scope.loginForm.$valid){
			$scope.loginDisabled = '';
		}else{
			$scope.loginDisabled = 'disabled';
		}
	};
	$scope.submitLogin = function(){
		if($scope.loginForm.$valid){
			console.log($scope.user);
			$scope.alert.warning($scope.i18n.get('not.implemented'), '');
		}
	};
	
}