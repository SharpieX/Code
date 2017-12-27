5
/*global angular*/
'use strict';
/*
 * This controller is responsible to enable/disable UI controls
 * in the view that shows details and answers of a question.
 * It checks if the user looking at it is the author (so that he
 * can eventually check answers as correct) or if the user
 * previously voted for it.
 * The main functions defined here are: `setChecked`, `comment`, `voteUp` and `voteDown`
 */
angular
.module('stack')
.controller('answerCtrl', ['$scope' ,'$rootScope', 'question', 'userService', 'questionsService', 'answersService', 'commentsService',
    function ($scope,$rootScope, question, userService, questionsService, answersService, commentsService) {

        var answerModel = this;
        if (userService.isLogged()) {
            /* Only logged users can update instances */
            questionsService.updateViews(question);
        }

	    userService.getUserModel().then(function (response) {
		    answerModel.user = response;
	    });

        answerModel.question = question;
        answerModel.question.showCommentArea = false;

        /*answerModel.qTotalVote = question.actions.votes.users_upvote.length - question.actions.votes.users_downvote.length;
        for (var i = 0, j = answerModel.question.answers.length; i < j; i++) {
            answerModel.question.answers[i].showCommentArea = false;
        }*/

        /* Redirects to login */
        answerModel.toLogin = function () {
            angular.element('#myModal').modal('show');
        };


        /* Returns true if the logged user has voted down */
        answerModel.checkVoteDown = function (users) {
            if (!users) {
                users = [];
            }
            var found = [];
            if (!answerModel.user) {
                return false;
            }
            if (users.length) {
                found = users.filter(function (userId) {
                    return userId === answerModel.user._id;
                });
            }

            return found.length > 0;
        };

        /* Returns true if the logged user is the author of the question */
        answerModel.canCheckAnswer = function () {
            if (!answerModel.user) {
                return false;
            }

            var canCheck = true;
            if (question.author._id === answerModel.user._id) {
                for (var i = 0, j = question.answers.length; i < j && canCheck; i++) {
                    var answer = question.answers[i];
                    if (answer.checked) {
                        canCheck = false;
                    }
                }
            } else {
                canCheck = false;
            }
            return canCheck;
        };

        /* Shows/Hide the comment area */
        answerModel.toggleCommentArea = function (model, $index, cobjectId) {
            if (!userService.isLogged()) {
                return;
            }

            if (cobjectId === 'answer') {
                var oldValue = answerModel.question.answers[$index].showCommentArea || false;
                answerModel.question.answers[$index].showCommentArea = !oldValue;
                for (var i = 0, j = answerModel.question.answers.length; i < j; i++) {
                    if (i !== $index) {
                        answerModel.question.answers[i].showCommentArea = false;
                    }
                }
            } else {
                answerModel.question.showCommentArea = !answerModel.question.showCommentArea;
            }
        };

        /* Set to true the checked attribute of the answer */
        answerModel.setChecked = function (question, answer) {
            answer.checked = !answer.checked;

            answersService.updateModel(answer, ['checked'])
            .then(function () {
                return questionsService.updateModel(question, 'checked');
            })
            .catch(function () {
                console.error('Error during check answer');
                answer.checked = false;
                question.checked = false;
            });
        };

        /* Comment an answer or a question */
        answerModel.commentQuestion = function (qModel, questionCommentText) {
            if (!userService.isLogged()) {
                return;
            }

            commentsService.createComment(qModel, questionCommentText, answerModel.user)
            .then(function (comment) {
                questionsService.commentQuestion(qModel, comment)
                .then(function () {
                    answerModel.questionCommentText = '';
                })
            })
            .catch(function (err) {
                console.log('Not authorized');
            });
        };

        answerModel.commentAnswer = function (aModel, answerText) {

            commentsService.createComment(aModel, answerText, answerModel.user)
            .then(function (comment) {
                answersService.comment(aModel,comment)
                .then(function () {
                    answerModel.commentAnswerText = '';
                })
                .catch(function (err) {
                    console.log('Not authorized');
                });
            });
        };

        /* Vote up the coinstance */
        answerModel.voteUp = function (qModel, aModel) {
            if (!userService.isLogged()) {
                return;
            }

            if (!aModel) {
                var user = userService.getUserModel();
                questionsService.voteUp(qModel,user)
                .then(function (totalVote) {
                    answerModel.qTotalVote = totalVote || 0;
                })
                .catch(function () {
                    console.log('Not authorized');
                });
            } else {
                answersService.voteUp(aModel)
                .then(function (totalVote) {
                    aModel.totalVote = totalVote;
                })
                .catch(function () {
                    console.log('Not authorized');
                });
            }
        };

        /* Vote down the coinstance */
        answerModel.voteDown = function (qModel, aModel) {
            if (!userService.isLogged()) {
                return;
            }

            if (!aModel) {
                questionsService.voteDown(qModel)
                .then(function (totalVote) {
                    answerModel.qTotalVote = totalVote || 0;
                })
                .catch(function (err) {
                    console.log("Not authorized");
                });
            } else {
                answersService.voteDown(aModel)
                .then(function (totalVote) {
                    aModel.totalVote = totalVote;
                })
                .catch(function (err) {
                    console.log("Not authorized");
                });
            }

        };
    }
]);