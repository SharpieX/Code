angular.module('stack')
.controller('SignupCtrl', ['$scope', '$location', '$auth', 'toastr', function ($scope, $location, $auth, toastr) {
	$scope.signup = function () {
		$auth.signup($scope.user)
		.then(function (response) {
			$auth.setToken(response);
			$location.path('/');
			toastr.info('You have successfully created a new account and have been signed-in');
		})
		.catch(function (response) {
			toastr.error(response.data.message);
		});
	};
}]);