angular.module('jigsaw', [])

.controller('homeCtrl', ['$scope', '$http', function($scope, $http) {
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
						'name': res[key].name
					} );
				}
				console.log($scope.repos);
			}

		})
		.error(function() {

		});
}]);