angular
.module('stack')
.controller('assignmentCtrl', ['$scope', 'Upload', '$timeout', '$http',  '$q' , function ($scope, Upload, $timeout, $http, $q) {
	$scope.paginatorCallback = paginatorCallback;

	$scope.subjectFilterCallback = subjectFilterCallback;
	$scope.subjectNameTransformer = subjectNameTransformer;

	$scope.classFilterCallback = classFilterCallback;
	$scope.classNameTransformer = classNameTransformer;


	// service units filter
	function classFilterCallback(){
		var arr = _.filter($scope.assignments, function(item){
			return item.class && item.class.toLowerCase();
		});

		arr = _.uniqBy(arr, function(item){ return item.class;});

		return $q.resolve(arr);
	}

	function classNameTransformer(value){
		return value.class.toUpperCase();
	}

	function subjectFilterCallback(){
		var arr = _.filter($scope.assignments, function(item){
			return item.subject && item.subject.toLowerCase();
		});

		arr = _.uniqBy(arr, function(item){ return item.subject;});

		return $q.resolve(arr);
	}

	function subjectNameTransformer(value){
		return value.subject.toUpperCase();
	}



	function paginatorCallback(page, pageSize, options){
		var offset = (page-1) * pageSize;
		var query = {};

		var filtersApplied = options.columnFilter;

		if (filtersApplied[2].length) {
			var classFilters = _.chain(filtersApplied[2])
			.pluck('tags')
			.map(function (item) {
				return item[0]._id
			}).value();
			query.class = classFilters;
		}
		if (filtersApplied[3].length) {
			var subjectFilter = _.chain(filtersApplied[3])
			.pluck('tags')
			.map(function (item) {
				return item[1]._id
			}).value();
			query.subject = subjectFilter;
		}


		return $http({
			method: 'POST',
			url: '/api/assignments',
			data: query
		}).then(function(response){
			$scope.assignments = response.data.data;
			_.each($scope.assignments, function(assignment, index){
				assignment.link = window.location.origin + "/api/resources/uuid?uuid=" + assignment.uuid;
				assignment.id = index+1;
				if(assignment.tags.length >=3){
					assignment.class = assignment.tags[0].name;
					assignment.subject = assignment.tags[1].name;
					assignment.chapter = assignment.tags[2].name;
				}
			});
			return {
				results: $scope.assignments.slice(offset, offset + pageSize),
				totalResultCount: $scope.assignments.length
			}
		})
	}

}]);