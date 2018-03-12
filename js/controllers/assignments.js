angular
.module('stack')
.controller('assignmentCtrl', ['$scope', 'Upload', '$timeout', '$http',  function ($scope, Upload, $timeout, $http) {
	$http({
		method: 'GET',
		url: '/api/assignments',
	}).then(function(response){
		$scope.assignments = response.data.data;
		console.log($scope.assignments);
		_.each($scope.assignments, function(assignment){
			assignment.link = window.location.origin + "/api/resources/uuid?uuid=" + assignment.uuid;
		})
	})

}]);