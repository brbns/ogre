angular.module("jigsaw",["ngRoute"]).config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){$routeProvider.when("/projects",{templateUrl:"assets/templates/home.html"}).when("/project/:projectName",{templateUrl:"assets/templates/repo.html"}).otherwise({redirectTo:"/projects"})}]).service("dataSrvc",["$http",function($http){var data={user:{name:"pravee-n",projects:[],currentProject:{}}};return data.endpoints={repos:"https://api.github.com/users/"+data.user.name+"/repos"},data.get=function(url){return $http.get(url)},data.setUserProjects=function(projects){for(var key in projects)data.user.projects.push(projects[key])},data.setCurrentProject=function(projectName){for(var i=0;i<data.user.projects.length;i++)projectName===data.user.projects[i].name&&(data.user.currentProject=data.user.projects[i])},data}]).controller("homeCtrl",["$scope","dataSrvc",function($scope,dataSrvc){$scope.username=dataSrvc.user.name,dataSrvc.user.projects.length||dataSrvc.get(dataSrvc.endpoints.repos).then(function(res){dataSrvc.setUserProjects(res.data)}),$scope.projects||($scope.projects=dataSrvc.user.projects),$scope.setProjectInfo=function(project){dataSrvc.user.currentProject=project}}]).controller("repoCtrl",["$scope","$routeParams","dataSrvc",function($scope,$routeParams,dataSrvc){function getReadmeInfo(){var readmeURL=$scope.project.url+"/readme";dataSrvc.get(readmeURL).then(function(res){$scope.project.readme=atob(res.data.content)})}$scope.project={};var projectNameFromURL=$routeParams.projectName;projectNameFromURL&&(dataSrvc.user.projects.length?($scope.project=dataSrvc.user.currentProject,getReadmeInfo()):dataSrvc.get(dataSrvc.endpoints.repos).then(function(res){dataSrvc.setUserProjects(res.data),dataSrvc.setCurrentProject(projectNameFromURL),$scope.project=dataSrvc.user.currentProject,getReadmeInfo()}))}]);