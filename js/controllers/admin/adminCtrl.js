angular
.module('stack')
.controller('adminAssignmentCtrl', ['$scope', 'Upload', '$timeout', 'tagsService',  '$http', function ($scope, Upload, $timeout, tagsService, $http) {


	$scope.categories = [{name:'class',options: []},{name:'subject',options: []},{name:'topic',options: []}];
	$scope.selectedTag = {};
	$scope.tags = [];

	function populateTags(params){
		tagsService.searchTag(params).then(function (response) {
			var tags = response.data.data;
			var groupedTgs = _.groupBy(tags, function (tag) {
				return tag.type;
			});
			for (var property in groupedTgs) {
				if (groupedTgs.hasOwnProperty(property)) {
					var match = _.find($scope.categories, function (item) {
						return item.name === property
					});
					match.options = groupedTgs[property];
				}
			}
		});
	}

	populateTags({'type': 'class'});
	$http({
		method: 'GET',
		url: '/api/assignments',
	}).then(function(response){
		$scope.assignments = response.data.data;
		_.each($scope.assignments, function(assignment){
			assignment.link = window.location.origin + "/api/resources/uuid?uuid=" + assignment.uuid;
		})
	});



	$scope.uploadFile = function(file) {
		file.upload = Upload.upload({
			url: 'api/homework',
			data: {tags: $scope.tags, file: file},
		});

		file.upload.then(function (response) {
			$timeout(function () {
				file.result = response.data;
				if (!response.err) {
					var assignment = response.data.data;
					assignment.link = window.location.origin + "/api/resources/uuid?uuid=" + assignment.uuid;
					if (!($scope.assignments && $scope.assignments.length)) {
						$scope.assignments = [];

					}
					$scope.assignments.push(assignment);

				}

			});
		}, function (response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		}, function (evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
	}


	$scope.removeAssignments = function(assignment){
		$http({
			method: 'GET',
			url: '/api/removeAssignment/id/',
			params: {id: assignment._id}
		}).then(function(response){
			if(!response.err){
				$scope.assignments = _.reject($scope.assignments, function(item){
					return item._id === assignment._id;
				})
			}

		});
	}

	$scope.onSelect = function ($item) { //jshint ignore:line

		if ($scope.tags.length === 0) {
			$scope.tags.push($item);
		} else {
			var indexByType = _.findIndex($scope.tags, function (item) {
				return item.type === $item.type
			});

			if (indexByType >= 0) {
				$scope.tags[indexByType] = $item;
			} else {
				$scope.tags.push($item);
			}
		}


		// when change class
		if($item.type === 'class'){
			//populate subject
			var matches = _.filter($scope.categories, function (item) {
				return item.name.toLowerCase() !== $item.type ;
			});

			// clear out all options first
			_.each(matches, function(match){

				// clear out selected tag
				delete $scope.selectedTag[match.name];
				match.options = [];
			});

			// else populate subjects
			var value = (6 <= $item.id  && $item.id <= 10) ? "6" : "10";
			var query = {
				$and: [
					{type: 'subject'},
					{$or: [{category: value}, {category: 0}]}
				]
			};
			populateTags(query);
		}

		// check if this class holds this subject exist for

		if($item.type === 'subject'){
			var matchedClass = _.find($scope.tags, function (item) {
				return item.type === 'class'
			});

			if(matchedClass){
				populateTags({type:'topic','category': parseInt(matchedClass.id), subject:$item.id});
			}

		}

		var type = $item.type;
		$scope.selectedTag[type] = $item;
	};


}]);


