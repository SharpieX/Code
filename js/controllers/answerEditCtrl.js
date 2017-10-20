angular
	.module('stack')
	.controller('answerEditCtrl', ['$scope', 'userService', 'answersService', 'questionsService', '$http',
		function ($scope, userService, answersService, questionsService, $http) {
			var answModel = this;

			if (userService.isLogged()) {

				answModel.newAnswer = {
					checked: false,
					text: ''
				};

			}
            answModel.user = userService.getUserModel();
			answModel.successInCreation = false;
			answModel.errorInCreation = false;

			answModel.createAnswer = function (questionModel) {
				answersService.createAnswer(answModel.newAnswer)
					.then(function (nAnswer) {

						nAnswer.author = answModel.user;
						nAnswer.dt_create = moment(nAnswer.dt_create).format('ll');

						questionsService.submitAnswer(questionModel, nAnswer)
                            .then(function () {
                                answModel.successInCreation = true;
                                answModel.newAnswer.text = '';
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