angular.module('jigsaw', ['ngRoute'])

.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		$locationProvider.html5mode({
			enabled: true
		});

		$routeProvider
			.when('/', {
				templateUrl: 'assets/templates/index.html'
			})
			.when('/repo/:name', {
				templateUrl: 'assets/templates/repo.html'
			})
			.otherwise({
				redirectTo: '/'
			});

	}])

.controller('homeCtrl', ['$scope', '$http', function($scope, $http) {
	console.log('homeCtrl');
	$scope.username = 'pravee-n';
	$scope.repos = [];

	var endpoints = {
		'repos': 'http://api.github.com/users/' + $scope.username + '/repos'
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