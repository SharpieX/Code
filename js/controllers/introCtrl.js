angular
.module('stack')
.controller('introCtrl', ['questionsService', '$scope', '$auth',
	function (questionsService, $scope, $auth) {
		angular.element('#navigation').sticky({topSpacing: 0});
		jQuery.event.trigger('appear');

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


		$('a.totop,a#btn-scroll,a.btn-scroll,.carousel-inner .item a.btn').bind('click', function (event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
	}]);