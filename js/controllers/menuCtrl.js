/*global angular*/
'use strict';

angular
	.module('stack')
	.controller('menuCtrl', ['$rootScope', '$scope', '$http', '$location','$auth',
		function ($rootScope, $scope, $http, $location,$auth) {
			$scope.$on('$routeChangeSuccess', function () {
				$scope.url = $location.url();
			});
			$scope.user = $rootScope.user;
			$scope.isAuthenticated = function () {
				return $auth.isAuthenticated();
			};

			/*$rootScope.$watch('user', function (newVal, oldVal) {
				$scope.user = newVal;
			}, true);*/

		}
	]);