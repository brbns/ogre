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

		// $locationProvider.html5Mode(true);
		// html5Mode.requireBase(false);
		// $locationProvider.hashPrefix('!');

}])


.service('dataSrvc', ['$http', function($http) {

	var data = {
		user: {
			'name': 'pravee-n',
			'projects': [],
			'currentProject': {}
		}
	};

	data.endpoints = {
		'repos': 'https://api.github.com/users/' + data.user.name + '/repos'
	};

	data.get = function(url) {
		return $http.get(url)
			.success(function( res ) {
				if (res !== undefined) {
					for (var key in res) {
						data.user.projects.push(res[key]);
					}
				}

			});
	};

	data.setCurrentProject = function(projectName) {
		for (var i = 0; i < data.user.projects.length; i++) {
			if (projectName === data.user.projects[i].name) {
				data.user.currentProject = data.user.projects[i];
			}
		}
	};

	return data;
}])

.controller('homeCtrl',
	['$scope', 'dataSrvc',
	function($scope, dataSrvc) {
		$scope.username = dataSrvc.user.name;
		if (!dataSrvc.user.projects.length) {
			dataSrvc.get(dataSrvc.endpoints.repos);
		}

		$scope.projects = dataSrvc.user.projects;
		$scope.setProjectInfo = function(project) {
			dataSrvc.user.currentProject = project;
		};
}])


.controller('repoCtrl',
	['$scope', '$routeParams', 'dataSrvc',
	function($scope, $routeParams, dataSrvc) {
		var projectNameFromURL = $routeParams.projectName;

		if (!projectNameFromURL) {
			return;
		}
		if (!dataSrvc.user.projects.length) {
			dataSrvc.get(dataSrvc.endpoints.repos)
				.then(function(res) {
					dataSrvc.setCurrentProject(projectNameFromURL);
					$scope.project = dataSrvc.user.currentProject;
					getReadmeInfo();
				});
		}
		else {
			$scope.project = dataSrvc.user.currentProject;
			getReadmeInfo();
		}

		// else if (projectNameFromURL !== dataSrvc.user.currentProject.name) {
		// 	return;
		// }

		function getReadmeInfo() {
			var readmeURL = $scope.project.url + '/readme';
			dataSrvc.get(readmeURL)
				.then(function(res) {
					$scope.project.readme = atob(res.data.content);
				});
		}




		// $http.get(readmeURL)
		// 	.success(function(res) {
		// 		$scope.project.readme = atob(res.content)
		// 	});
}]);