angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'	
		})

		.when('/win2', {
			templateUrl: 'views/normalMap.html',
			controller: 'NormalMapController'
		})

		.when('/win3', {
			templateUrl: 'views/depthMap.html',
			controller: 'DepthMapController'	
		})

	$locationProvider.html5Mode(true);

}]);