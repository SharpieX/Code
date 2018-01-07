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
		askModel.categories = [{name:'class',options: []},{name:'subject',options: []},{name:'topic',options: []}]

		userService.getUserModel().then(function (response) {
			askModel.cobj.author = response._id;
		});

		/**
		 * populate
		 * @param params
		 */
		function populateTags(params){
			tagsService.searchTag(params).then(function (response) {
				var tags = response.data.data;
				var groupedTgs = _.groupBy(tags, function (tag) {
					return tag.type;
				});
				for (var property in groupedTgs) {
					if (groupedTgs.hasOwnProperty(property)) {
						var match = _.find(askModel.categories, function (item) {
							return item.name === property
						});
						match.options = groupedTgs[property];
					}
				}
			});
		}

		populateTags({'type': 'class'});

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

			// TODO:remove old tags first from array

			if (askModel.cobj.tags.length === 0) {
				askModel.cobj.tags.push($item);
			} else {
				var indexByType = _.findIndex(askModel.cobj.tags, function (item) {
					return item.type === $item.type
				});

				if (indexByType >= 0) {
					askModel.cobj.tags[indexByType] = $item;
				} else {
					askModel.cobj.tags.push($item);
				}
			}


			// when change class
			if($item.type === 'class'){
				//populate subject
				var matches = _.filter(askModel.categories, function (item) {
					return item.name.toLowerCase() !== $item.type ;
				});

				// clear out all options first
				_.each(matches, function(match){

					// clear out selected tag
					delete askModel.selectedTag[match.name];
					match.options = [];
				});

				// else populate subjects
				var value = (6 <= $item.id  && $item.id < 10) ? "6" : "10";
				var query = {
					$and: [
						{type: 'subject'},
						{$or: [{category: value}, {category: 0}]}
					]
				};
				populateTags(query);
				askModel.showSimpleToast('Next Choose Subject ');
			}

			// check if this class holds this subject exist for

			if($item.type === 'subject'){
				var matchedClass = _.find(askModel.cobj.tags, function (item) {
					return item.type === 'class'
				});

				if(matchedClass){
					askModel.showSimpleToast('Next Choose Topic ');
					populateTags({type:'topic','category': parseInt(matchedClass.id), subject:$item.id});
				} else {
					askModel.showSimpleToast('Select Class first ');
				}

			}

			var type = $item.type;
			askModel.selectedTag[type] = $item;
		};

		/* Creates a new question */
		askModel.createQuestion = function () {
			askModel.busy = true;
			askModel.cobj.tags = _.pluck(askModel.cobj.tags,'_id');
			if (askModel.cobj.tags.length < 2) {
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