/*global angular*/
'use strict';
/*
`homeModel` stores the `sort` criteria currently used to list the questions. 
(I.E: `sort: {newest: true, votes: false, active:false}`. 
When the controller starts `loadQuestion` is triggered and 
it loads questions, their authors and also checks if a "checked" 
(correct) answer already exists. `updateSortingOptions` is called 
when we need to change the sort criteria.
*/
angular
	.module('stack')
	.controller('homeCtrl', ['questionsService',
		function (questionsService) {
			var homeModel = this;

			homeModel.questions = [];
			homeModel.page = 1;
			homeModel.per_page = 10;
			homeModel.sort = '-dt_create';
			homeModel.style = 'stamp';

			homeModel.expertAnswered = function(question){
				var verifiedAnswer = _.filter(question.answers, function(answer){
					return answer.checked;
				});

				return  verifiedAnswer && verifiedAnswer.length > 0
			}

			/* Loads the questions given a sort parameter */
			homeModel.loadQuestions = function (params) {
				questionsService.getQuestions(params)
					.then(function (result) {
						homeModel.questions = result.data.data;
						//homeModel.total = result.pagination;
						//homeModel.page++;
						//homeModel.busy = false;
					});
			};

			homeModel.loadNext = function (page) {
					if(homeModel.total === homeModel.questions.length) return;

					homeModel.busy = true;
					var params = {
						sort: homeModel.sort,
						page: page,
						per_page: homeModel.per_page,
						populate_owner: true,
						populate: true
					}

					homeModel.loadQuestions(params);

			};

			/* Listener on tab */
			/*homeModel.sortQuestion = function (sortOn) {
				homeModel.busy = true;
				homeModel.page = 1;
				homeModel.totalLength = 0;
				homeModel.questions.length = 0;
				switch (sortOn) {
				case 'newest':
					homeModel.sort = '-dt_create';
					break;
				case 'votes':
					homeModel.sort = '-actions.votes.total';
					break;
				case 'active':
					homeModel.sort = '-dt_update';
					break;
				default:
					homeModel.sort = '-dt_create';
					break;
				}

				homeModel.loadQuestions({
					sort: homeModel.sort,
					page: homeModel.page,
					per_page: homeModel.per_page,
					populate_owner: true,
					populate: true
				});
			};*/
		}
	]);