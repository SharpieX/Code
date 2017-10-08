/*global angular*/
'use strict';

angular
	.module('stack.service')
	.factory('answersService', ['$q', 'usersService', '$stamplay', '$http', function ($q, usersService, $stamplay, $http) {

		function _getTotalVotes(model) {
			return model.actions.votes.users_upvote.length - model.actions.votes.users_downvote.length
		}

		return {

            createAnswer: function (params) {
                return $http({
                    method: 'POST',
                    url: '/api/saveAnswer',
                    data: params
                })
            },

			updateModel: function (answer, attrs) {
				var checkedAnswer = {};
				attrs.forEach(function (key) {
					checkedAnswer[key] = answer[key];
				});
				
                checkedAnswer._id = answer._id;
                return $http({
                    method: 'POST',
                    url: '/api/updateAnswer',
                    data: checkedAnswer,
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

			comment: function (aModel, commentText) {
				var def = $q.defer();
				//cache populate data
				var answer = aModel;

				$stamplay.Object("answer").comment(answer._id, commentText)
					.then(function (res) {
						answer.actions = res.actions;
						def.resolve();
					})
					.catch(function (err) {
						def.reject(err);
					})

				return def.promise;
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