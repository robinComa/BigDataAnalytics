function Map($scope) {
	try{
		this.ICON_HOME = new google.maps.MarkerImage('img/marker/red-dot.png');
		this.ICON_BLUE = new google.maps.MarkerImage('img/marker/blue-dot.png');
		this.ICON_GREEN = new google.maps.MarkerImage('img/marker/green-dot.png');
		this.ICON_YELLOW = new google.maps.MarkerImage('img/marker/yellow-dot.png');
	
		var mapOptions = {
			zoom: 4,
			center: new google.maps.LatLng(20, 0),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.obj = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	}catch(err){
		$scope.alert.warning($scope.i18n.get('map.creation.error'), err.toString());
	}	
	
	this.geolocation = function(callback){
		var map = this.obj;
		function noGeolocation(err){
			callback({
				longitude: 0,
				latitude: 0
			});
			$scope.alert.warning($scope.i18n.get('map.geolocation.error'), err);
		}
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position) {
				$scope.alert.info($scope.i18n.get('info'), $scope.i18n.get('map.geolocation.success'));
				try{
					map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
				}catch(err){}
				callback({
					longitude: position.coords.longitude,
					latitude: position.coords.latitude
				});
			}, function(positionError){
				noGeolocation(positionError.message);
			});
		}else{
			noGeolocation($scope.i18n.get('html5.error'));
		}
	};
	this.addMarker = function(icon, lon, lat, title, description){
		try{
			var map = this.obj;
						
			var marker = new google.maps.Marker({
				map : map,
				icon : icon,
				animation : google.maps.Animation.DROP,
				position : new google.maps.LatLng(lon, lat)
			});
			
			var infowindow = new google.maps.InfoWindow({
				content : $('<div/>').append(
							$('<b/>').addClass('text-info').text(title)
						).append(
							$('<p/>').addClass('muted').text(description)
						).html()
			});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map, marker);
			});
			if (icon != this.ICON_HOME){
				setTimeout(function() {
					marker.setMap(null);
				}, 60000);
			}
		}catch(err){
			$scope.alert.warning($scope.i18n.get('map.marker.error'), err.toString());
		};
	};
}

