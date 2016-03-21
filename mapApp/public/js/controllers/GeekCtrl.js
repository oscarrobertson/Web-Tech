angular.module('GeekCtrl', []).controller('GeekController', function($scope,$timeout, $http, $q) {

	$scope.tagline = 'Tagline to window 3';	
	$scope.dataLength = 1000;

	$scope.initialize = function() {
  		var mapCanvas = document.getElementById('map-canvas');
  		if (mapCanvas == null){
  			return -1;
  		}
  		var mapOptions = {
  			center: new google.maps.LatLng(53.223668,-1.102773),
      		zoom: 6,
      		mapTypeId: google.maps.MapTypeId.ROADMAP
    	}
  		var map = new google.maps.Map(mapCanvas,mapOptions);

	  	$scope.square = new google.maps.Rectangle({
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: map,
			draggable: true,
			bounds: {
			  north: 52.713416,
			  south: 51.323747,
			  east: 1.72521973,
			  west: -0.57678223
			}
		});
		$scope.circle = new google.maps.Circle({
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: map,
			draggable: true,
			center: {lat: 53.223668, lng: -1.102773}, 
			radius: 100000
		});
		$scope.sqPaths = [];
		$scope.sqPaths.push(new google.maps.LatLng(51,1));
		$scope.sqPaths.push(new google.maps.LatLng(51,1.5));
		$scope.sqPaths.push(new google.maps.LatLng(51.5,1.5));
		$scope.sqPaths.push(new google.maps.LatLng(51.5,1));
		$scope.diamond = new google.maps.Polygon({
			    map: map,
			    paths: $scope.sqPaths,
			    strokeColor: '#0000FF',
			    strokeOpacity: 0.8,
			    strokeWeight: 2,
			    fillColor: '#0000FF',
			    fillOpacity: 0.35,
			    draggable: false,
			    geodesic: false
			});
		console.log($scope.square.getBounds())
		google.maps.event.addListener(map, 'click', function(e) {
	  	});
	  	google.maps.event.addListener($scope.circle, 'dragend', function(e) {
	  		var circBounds = $scope.circle.getBounds();
	  		$scope.square.setBounds($scope.circle.getBounds());

	  		var sqb = {
	  			n : circBounds.getNorthEast().lat(),
	  			s : circBounds.getSouthWest().lat(),
	  			e : circBounds.getNorthEast().lng(),
	  			w : circBounds.getSouthWest().lng()
	  		}
	  		var requestString = 'http://localhost:8080/api/LatLonSquToMap?n=' + sqb.n + 
	  		'&s=' + sqb.s + 
	  		'&e=' + sqb.e + 
	  		'&w=' + sqb.w ;
		  	$http({
			  method: 'GET',
			  url: requestString
			}).then(function successCallback(response) {
			    
				// console.log(response.data.res);
				// console.log(response.data.res2);

				var res2 = response.data.res2;
				console.log(res2);

				var newPaths = [];
				for (i=0;i<4;i++){
					newPaths.push( new google.maps.LatLng(res2[i].lat,res2[i].lon));
				}
				$scope.sqPaths = newPaths;
				$scope.diamond.setPaths(newPaths);
				console.log("newpaths");

			  }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log("API failure - LatLonSquToMap");
			});

	  	});
  	}



  	$timeout($scope.initialize(), 100);

});