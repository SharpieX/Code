angular.module('stack.service')
.factory('Account', ['$http', function($http) {
	return {
		getProfile: function() {
			return $http.get('/api/me');
		},
		updateProfile: function(profileData) {
			return $http.put('/api/me/update', profileData);
		},
		forgotPassword: function(data) {
			return $http.post('/api/forgot', data);
		},
		resetPassword: function(data) {
			var token = location.hash.split('/')[2].trim();
			return $http.post('/api/reset/'+token, data);
		}
	};
}]);