angular.module('jigsaw', ['ngRoute'])

.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		// $locationProvider.html5mode({
		// 	enabled: true
		// });

		$routeProvider
			.when('/projects', {
				templateUrl: 'assets/templates/home.html',
				controller: 'homeCtrl'
			})
			.when('/project/:projectName', {
				templateUrl: 'assets/templates/repo.html',
				controller: 'repoCtrl'
			})
			.otherwise({
				redirectTo: '/projects'
			});

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');

	}])


.controller('homeCtrl', ['$scope', '$http', function($scope, $http) {
	console.log('homeCtrl');
	$scope.username = 'pravee-n';
	$scope.repos = [];

	var endpoints = {
		'repos': 'https://api.github.com/users/' + $scope.username + '/repos'
	};

	$http.get(endpoints.repos)
		.success(function( res ) {
			console.log(res);
			if (res !== undefined) {
				for (var key in res) {
					$scope.repos.push( {
						'name': res[key].name,
						'id': res[key].id
					} );
				}
				console.log($scope.repos);
			}

		})
		.error(function() {

		});
}]);