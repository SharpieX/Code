/*global angular*/
'use strict';

angular
	.module('stack.service')
	.factory('tagsService', ['$http', function ($http) {

		return {

			getTags: function (options) {
                return $http({
                    method: 'GET',
                    url: '/api/getTags'
                });
			},

			getById: function (tagId) {

			},

			searchTag: function (params) {
                return $http({
                    method: 'POST',
                    url: '/api/searchTags',
					data:params
                });
			}

		};
	}])