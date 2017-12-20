angular.module('stack')
.controller('LogoutCtrl', function($location, $auth, toastr, $rootScope, $state) {
	if (!$auth.isAuthenticated()) { return; }
	$auth.logout()
	.then(function() {
		toastr.info('You have been logged out');
		$rootScope.user = '';
		$location.path('/');
		$state.go('intro')
	});
});