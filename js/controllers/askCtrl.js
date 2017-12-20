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
	.controller('askCtrl', ['$rootScope', '$http', '$location', 'userService', 'tagsService', 'questionsService', 'Upload',
		function ($rootScope, $http, $location, userService, tagsService, questionsService, Upload) {
			var askModel = this;
			askModel.cobj = {};
			askModel.cobj.tags = [];
			askModel.selected = [];
			askModel.cobj.answers = [];
			askModel.cobj.views = 0;
			askModel.questionSubmitted = false;
            askModel.cobj.author = userService.getUserModel()._id;

			userService.getUserModel().then(function (response) {
				askModel.cobj.author = response._id;
			});

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
					where: {name: {"$regex" : val}}
				};

				return tagsService.searchTag(query)
					.then(function (res) {
						askModel.tags = res.data.data.map(function(tag) {
							if(askModel.cobj.tags.indexOf(tag._id) < 0) {
								return {
									name : tag.name,
									_id : tag._id
								}
							}
						})

						return _.without(askModel.tags, undefined);
					});
			};

			askModel.onSelect = function ($item, $model, $label) { //jshint ignore:line				
				askModel.selected.push($item);
				askModel.cobj.tags.push($item._id);
				askModel.current = ""
			};

			askModel.removeTag = function(idx) {
				askModel.cobj.tags.splice(idx, 1);
				askModel.selected.splice(idx, 1);
			}

			/* Creates a new question */
			askModel.createQuestion = function () {
				askModel.busy = true
				questionsService.saveQuestion(askModel.cobj)
					.then(function () {
						askModel.cobj = {};
						askModel.cobj.tags = [];
						askModel.cobj.answers = [];
						askModel.cobj.views = 0;
						askModel.cobj.author = userService.getUserModel()._id
						askModel.cobj.owner = userService.getUserModel()._id
						askModel.cobj.text = '';
						askModel.current = '';
						askModel.questionSubmitted = true;
						askModel.busy = false;
						$location.url('/index');

					})
					.catch(function (err) {
						console.log(err); //jshint ignore:line
					});
			};

		}
	]);