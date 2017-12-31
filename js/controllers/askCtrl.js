/*global angular*/
'use strict';
/*
When this controller starts it initializes two variables 
in the `$scope`: `cobj` and `questionSubmitted`. 
The former represent the new instance for the question 
while the latter is a boolean value to check that the 
question has been submitted succesfully.
It also implement the function `getTags` for autocompleting 
the tag that users can bind to the question.
*/
angular
.module('stack')
.controller('askCtrl', ['$rootScope', '$http', '$location', 'userService', 'tagsService', 'questionsService', 'Upload', '$mdToast',
	function ($rootScope, $http, $location, userService, tagsService, questionsService, Upload, $mdToast) {
		var askModel = this;
		askModel.chapaters;
		askModel.cobj = {};
		askModel.cobj.tags = [];
		askModel.selectedTag = {};
		askModel.cobj.answers = [];
		askModel.cobj.views = 0;
		askModel.questionSubmitted = false;

		userService.getUserModel().then(function (response) {
			askModel.cobj.author = response._id;
		});

		tagsService.getTags().then(function (response) {
			var tags = _.sortBy(response.data.data,'level');
			var groupedTgs = _.groupBy(tags, function (tag) {
				return tag.type;
			});
			askModel.chapters =  _.groupBy(groupedTgs['chapter'],'category');
			groupedTgs['chapter'] = [];
			askModel.tags = groupedTgs
			console.log(askModel.tags);
		})

		var last = {
			bottom: true,
			top: false,
			left: false,
			right: true
		};

		askModel.toastPosition = angular.extend({}, last);

		askModel.getToastPosition = function () {
			sanitizePosition();

			return Object.keys(askModel.toastPosition)
			.filter(function (pos) {
				return askModel.toastPosition[pos];
			})
			.join(' ');
		};

		function sanitizePosition() {
			var current = askModel.toastPosition;

			if (current.bottom && last.top) current.top = false;
			if (current.top && last.bottom) current.bottom = false;
			if (current.right && last.left) current.left = false;
			if (current.left && last.right) current.right = false;

			last = angular.extend({}, current);
		}

		askModel.showSimpleToast = function (string) {
			var pinTo = askModel.getToastPosition();

			$mdToast.show(
				$mdToast.simple()
				.textContent(string)
				.position(pinTo)
				.hideDelay(3000)
			);
		};


		/*  askModel.upload = function (file) {
			  if(file) {
				  Upload.upload({
					  url: '/api/upload',
					  data: {file: file}
				  }).then(function (resp) {
					  console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				  }, function (resp) {
					  console.log('Error status: ' + resp.status);
				  }, function (evt) {
					  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					  console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				  });
			  }
		  };*/

		askModel.tags = [];
		var tagName2Id = {};

		/* Used from typeahead to retrieve tags that matches the user search */
		askModel.getTags = function (val) {
			askModel.tags.length = 0;
			var query = {
				where: {name: {"$regex": val}}
			};

			return tagsService.searchTag(query)
			.then(function (res) {
				askModel.tags = res.data.data.map(function (tag) {
					if (askModel.cobj.tags.indexOf(tag._id) < 0) {
						return {
							name: tag.name,
							_id: tag._id
						}
					}
				})

				return _.without(askModel.tags, undefined);
			});
		};

		askModel.onSelect = function ($item) { //jshint ignore:line
			askModel.cobj.tags.push($item._id);
			if($item.type === 'category'){
				askModel.tags['chapter'] =  askModel.chapters[$item.id];
			}
			var type = $item.type;
			askModel.selectedTag[type] = $item;
		};

		/*askModel.removeTag = function(idx) {
			askModel.cobj.tags.splice(idx, 1);
			askModel.selected.splice(idx, 1);
		}*/

		/* Creates a new question */
		askModel.createQuestion = function () {
			askModel.busy = true;

			if (askModel.cobj.tags.length !== 2) {
				askModel.showSimpleToast('Select atleast first two tags');
				askModel.busy = false;
				return;
			}


			if (!askModel.cobj.title) {
				askModel.showSimpleToast('Title is required');
				askModel.busy = false;
				return;
			}

			questionsService.saveQuestion(askModel.cobj)
			.then(function () {
				askModel.cobj = {};
				askModel.cobj.tags = [];
				askModel.cobj.answers = [];
				askModel.cobj.views = 0;
				askModel.cobj.author = ''
				askModel.cobj.owner = ''
				askModel.cobj.text = '';
				askModel.current = '';
				askModel.questionSubmitted = true;
				askModel.busy = false;
				$location.url('/dashboard');

			})
			.catch(function (err) {
				console.log(err); //jshint ignore:line
			});
		};

	}
]);