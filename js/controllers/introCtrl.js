angular
.module('stack')
.controller('introCtrl', ['questionsService', '$scope', '$auth','$http',
	function (questionsService, $scope, $auth, $http) {
		angular.element('#navigation').sticky({topSpacing: 0});

		$scope.goTo = function ($event) {
			var $anchor = $($event.currentTarget);
			var nav = $($anchor.attr('href'));
			if (nav.length) {
				$('html, body').stop().animate({
					scrollTop: $($anchor.attr('href')).offset().top
				}, 1500, 'easeInOutExpo');

				event.preventDefault();
			}
		}

		$scope.isAuthenticated = function () {
			return $auth.isAuthenticated();
		};

		$scope.contactUs = function (valid) {
			var data = {
				from: $scope.email,
				text: $scope.text,
				subject: $scope.subject

			};

			if (valid) {
				$http({
					method: 'POST',
					url: '/api/sendEmail',
					data: data,
				}).then(function (res) {
					if(res.data.error){
						$scope.showError = true;
					} else {
						$scope.showSuccess = true;
					}
				})
			}
		}

		$('a.totop,a#btn-scroll,a.btn-scroll,.carousel-inner .item a.btn').bind('click', function (event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
	}]);