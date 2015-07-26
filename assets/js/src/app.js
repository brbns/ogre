angular.module('jigsaw', ['ngRoute'])

.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		$routeProvider
			.when('/projects', {
				templateUrl: 'assets/templates/home.html',
			})
			.when('/project/:projectName', {
				templateUrl: 'assets/templates/repo.html',
			})
			.otherwise({
				redirectTo: '/projects'
			});

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');

	}])

.factory('user', [function() {
	return {};
}])

.controller('homeCtrl', ['$scope', '$http', 'user', function($scope, $http, user) {
	$scope.username = 'pravee-n';
	$scope.projects = [];

	user.name = $scope.username;

	var endpoints = {
		'repos': 'https://api.github.com/users/' + $scope.username + '/repos'
	};

	$http.get(endpoints.repos)
		.success(function( res ) {
			if (res !== undefined) {
				for (var key in res) {
					$scope.projects.push(res[key]);
				}
				user.projects = $scope.projects;
			}

		})
		.error(function() {

		});

	$scope.setProjectInfo = function(project) {
		user.currentProject = project;
	};
}])


.controller('repoCtrl',
	['$scope', '$routeParams', 'user', '$http',
	function($scope, $routeParams, user, $http) {
		if ($routeParams.projectName && ($routeParams.projectName !== user.currentProject.name)) {
			return;
		}

		$scope.project = user.currentProject;

		var readmeURL = $scope.project.url + '/readme';

		$http.get(readmeURL)
			.success(function(res) {
				$scope.project.readme = atob(res.content)
			});
}]);