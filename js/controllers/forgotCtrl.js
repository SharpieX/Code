angular.module('stack')
.controller('ForgotCtrl', ['$scope', 'Account', function ($scope, Account) {
	$scope.forgotPassword = function () {
		Account.forgotPassword($scope.currentUser)
		.then(function (response) {
			$scope.messages = {
				success: [response.data]
			};
		})
		.catch(function (response) {
			$scope.messages = {
				error: Array.isArray(response.data) ? response.data : [response.data]
			};
		});
	};
}]);
