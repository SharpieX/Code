angular
	.module('stack')
	.controller('answerEditCtrl', ['$scope', 'userService', 'answersService', 'questionsService', '$http','notificationService',
		function ($scope, userService, answersService, questionsService, $http ,notificationService) {
			var answModel = this;

			if (userService.isLogged()) {

				answModel.newAnswer = {
					checked: false,
					text: ''
				};

			}
			userService.getUserModel().then(function (response) {
				answModel.user = response;
			});

			answModel.successInCreation = false;
			answModel.errorInCreation = false;

			answModel.createAnswer = function (questionModel) {
				answersService.createAnswer(answModel.newAnswer,answModel.user )
					.then(function (nAnswer) {

						nAnswer.author = answModel.user;
						nAnswer.dt_create = moment(nAnswer.dt_create).format('ll');

						questionsService.submitAnswer(questionModel, nAnswer)
                            .then(function () {
                                answModel.successInCreation = true;
                                answModel.newAnswer.text = '';
	                            notificationService.notify(questionModel.author.email, 'Question Answered').then(function(){
	                            	console.log("Question Answered");
	                            })
                            })
							.catch(function (err) {
								console.log(err)
								answModel.errorInCreation = true;
								setTimeout(function () {
									answModel.successInCreation = false;
								}, 2000);
							});

					}).catch(function (err) {
						console.log(err)
						answModel.errorInCreation = true;
					});
			}

		}
	])