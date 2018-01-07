'use strict'

angular.module('stack.service').factory('CONSTANTS', function () {

	var CONSTANTS = {
		USER_PERMS: {
			ADMIN: {
				key: 'admin'
			},
			USER: {
				key: 'user'
			}
		}
	}
	return CONSTANTS;
});