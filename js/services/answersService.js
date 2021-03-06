/*global angular*/
'use strict';

angular
	.module('stack.service')
	.factory('answersService', ['$q', 'userService', '$stamplay', '$http', function ($q, userService, $stamplay, $http) {

		function _getTotalVotes(model) {
			return model.actions.votes.users_upvote.length - model.actions.votes.users_downvote.length
		}

		return {

            createAnswer: function (params) {
                var authorId = userService.getUserModel()._id;
                params.author = authorId;
                return $http({
                    method: 'POST',
                    url: '/api/saveAnswer',
                    data: params
                })
            },

			updateModel: function (answer, attrs) {
				var answerModel = {};

				attrs.forEach(function (key) {
					var answerIDs = [];
					for (var i = 0; i < answer[key].length; i += 1) {
						answerIDs.push(answer[key][i]._id);
					}
					;
					answerModel[key] = answerIDs;
				});

				answerModel._id = answer._id;

				return $http({
					method: 'POST',
					url: '/api/updateAnswer',
					data: answerModel,
				})
			},

			voteUp: function (aModel) {
				var def = $q.defer();
				//cache populate data
				var answer = aModel;

				$stamplay.Object("answer").upVote(answer._id)
					.then(function (res) {
						answer.actions = res.actions;
						def.resolve(_getTotalVotes(answer));
					})
					.catch(function (err) {
						def.reject(err);
					})

				return def.promise;
			},

			voteDown: function (aModel) {
				var def = $q.defer();
				//cache populate data
				var answer = aModel;

				$stamplay.Object("answer").downVote(answer._id)
					.then(function (res) {
						answer.actions = res.actions;
						def.resolve(_getTotalVotes(answer));
					})
					.catch(function (err) {
						def.reject(err);
					})

				return def.promise;
			},

			comment: function (aModel, comment) {
				var newComments = aModel.comments ? aModel.comments:[];
				newComments.push(comment.data.data);
				aModel.comments = newComments;
				return this.updateModel(aModel, ['comments']);

			},

			getById: function (answerId) {
                $http({
                    method: 'GET',
                    url: '/api/getAnswer/id',
                    params: {id: answerId}
                })
			}
		};
	}]);