angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainController'
		})

		.when('/win2', {
			templateUrl: 'views/nerd.html',
			controller: 'NerdController'
		})

		.when('/win3', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		})

		.when('/win4', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'	
		});

	$locationProvider.html5Mode(true);

}]);