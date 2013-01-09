function BootstrapCtrl ($scope, $rootScope, I18n) {

	$scope.urls = {
		//jobstack : 'http://jobstack.cloud-bigdata.com'
		jobstack : 'http://localhost:8080/BigDataJobstack'
	};
	
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
		$scope.map.addMarker($scope.map.ICON_HOME, coordinates.latitude, coordinates.longitude, $scope.i18n.get('map.position.titre'), $scope.i18n.get('map.position.description'));
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