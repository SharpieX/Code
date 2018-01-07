/*global angular, async*/
'use strict';

angular
    .module('stack.service')
    .factory('questionsService', ['$q', 'userService', 'tagsService', 'answersService', '$http',
        function ($q, userService, tagsService, answersService, $http) {

            var questions = [];
            var pagination = {};

            function _getTotalVotes(model) {
                return model.users_upvote.length - model.users_downvote.length
            }

            return {
                getQuestions: function (param) {
                    return $http({
                        method: 'GET',
                        url: '/api/getQuestions'
                    })
                },


                searchQuestion: function (questionId) {
                    var def = $q.defer();
                    $http({
                        method: 'GET',
                        url: '/api/searchQuestion/id',
                        params: {id: questionId}
                    }).then(function (res) {
                        var question = res.data.data;
                        def.resolve(question);
                    }).catch(function (err) {
                        def.reject(err);
                    })
                    return def.promise;
                },

                /*
                 * Retrieve question and populate answer models
                 */
                getById: function (questionId) {
                    var def = $q.defer();

                    this.searchQuestion(questionId)
                        .then(function (question) {
                            def.resolve(question);
                        });

                    return def.promise;
                },

                updateViews: function (question) {
                    var actualViews = question.views || 0;
                    actualViews++;
                    //return $stamplay.Object("question").patch(question._id, {views: actualViews})
                },

                updateModel: function (question, attrs) {
                    var questionModel = {};

                    attrs.forEach(function (key) {
                        var answerIDs = [];
                        for (var i = 0; i < question[key].length; i += 1) {
                            answerIDs.push(question[key][i]._id);
                        }
                        ;
                        questionModel[key] = answerIDs;
                    });

                    questionModel._id = question._id;
                    return $http({
                        method: 'POST',
                        url: '/api/updateQuestion',
                        data: questionModel,
                    })
                },

                voteUp: function (qModel,user) {
                    var def = $q.defer();
                    //cache populate data
                    var question = qModel;
					var users_upvote = question.users_upvote ? question.users_upvote : [];
					users_upvote.push(user._id);
					question.users_upvote = users_upvote;
                    this.updateModel(question, ['users_upvote']).then(function(){
						def.resolve(_getTotalVotes(question));
                    })
					.catch(function (err) {
						def.reject(err);
					})

                    return def.promise;
                },

                voteDown: function (qModel) {
                    var def = $q.defer();
                    //cache populate data
                    var question = qModel;

                   /* $stamplay.Object("question").downVote(qModel._id)
                        .then(function (res) {
                            question.actions = res.actions;
                            def.resolve(_getTotalVotes(question));
                        })
                        .catch(function (err) {
                            def.reject(err);
                        })*/

                    return def.promise;
                },

                commentQuestion: function (question, comment) {
                    var newComments = question.comments
                    newComments.push(comment.data.data);
                    question.comments = newComments;
                    return this.updateModel(question, ['comments']);
                },

                saveQuestion: function (params) {
                    return $http({
                        method: 'POST',
                        url: '/api/saveQuestion',
                        data: params
                    });
                },

                submitAnswer: function (question, nAnswer) {
                    var newAnswers = question.answers
                    newAnswers.push(nAnswer.data.answer);

	                question.answers = _(newAnswers).chain().sortBy(function(answer) {
		                return answer.author.role;
	                }).sortBy(function(answer) {
		                return !answer.checked;
	                }).value();

                    return this.updateModel(question, ['answers']);
                }

            };
        }]);