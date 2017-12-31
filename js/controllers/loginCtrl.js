angular.module('stack')
.controller('LoginCtrl', ['$scope', '$location', '$auth', 'toastr', '$state', 'userService', '$rootScope', function ($scope, $location, $auth, toastr, $state, userService, $rootScope) {
	$scope.login = function () {
		$auth.login($scope.userObj)
		.then(function () {
			toastr.success('You have successfully signed in!');
			$state.go('intro');
			userService.getUserModel()
			.then(function (userResp) {
				$rootScope.user = userResp;
			});
		})
		.catch(function (error) {
			toastr.error(error.data.message, error.status);
		});
	};
	$scope.authenticate = function (provider) {
		$auth.authenticate(provider)
		.then(function () {
			toastr.success('You have successfully signed in with ' + provider + '!');
			//$location.path('/');
			$state.go('intro');
			userService.getUserModel()
			.then(function (userResp) {
				$rootScope.user = userResp;
			});
		})
		.catch(function (error) {
			if (error.message) {
				// Satellizer promise reject error.
				toastr.error(error.message);
			} else if (error.data) {
				// HTTP response error from server
				toastr.error(error.data.message, error.status);
			} else {
				toastr.error(error);
			}
		});
	};
}]);
