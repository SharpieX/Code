/*global angular*/
'use strict';

/*angular.module('stack', ['stack.service', 'infinite-scroll', 'ngRoute', 'ui.router',
	'ui.bootstrap', 'textAngular', 'ngStamplay', 'ngFileUpload',
	'satellizer', 'toastr', 'ngMaterial', 'ngMessages',
	"com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	"com.2fdevs.videogular.plugins.overlayplay",
	"com.2fdevs.videogular.plugins.buffering",
	"info.vietnamcode.nampnq.videogular.plugins.youtube",
	"com.2fdevs.videogular.plugins.poster"
]);*/
angular.module('stack', ['stack.service', 'infinite-scroll', 'ngRoute', 'ui.router',
	'ui.bootstrap', 'textAngular', 'ngStamplay', 'ngFileUpload',
	'satellizer', 'toastr', 'ngMaterial', 'ngMessages'
]);

angular
.module('stack')
.run(['$rootScope', 'userService','$auth',
	function ($rootScope, userService, $auth) {
		if ($auth.isAuthenticated()) {
			userService.getUserModel()
			.then(function (userResp) {
				$rootScope.user = userResp;
			});
		}
	}

])
.config(function ($stateProvider, $urlRouterProvider, $provide, $locationProvider, $authProvider, $mdThemingProvider) {

	$authProvider.loginUrl = '/api/auth/login';
	$authProvider.signupUrl = '/api/auth/signup';

	$authProvider.facebook({
		clientId: '1459189657469557',
		name: 'facebook',
		url: '/api/auth/facebook',
		authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
		redirectUri: window.location.origin + '/',
		requiredUrlParams: ['display', 'scope'],
		scope: ['email'],
		scopeDelimiter: ',',
		display: 'popup',
		oauthType: '2.0',
		popupOptions: {width: 580, height: 400}
	});

	$mdThemingProvider.theme('default').primaryColor("blue").accentColor("red");
	/**
	 * Helper auth functions
	 */
	var skipIfLoggedIn = ['$q', '$auth', function ($q, $auth) {
		var deferred = $q.defer();
		if ($auth.isAuthenticated()) {
			deferred.reject();
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	}];

	var loginRequired = ['$q', '$location', '$auth', function ($q, $location, $auth) {
		var deferred = $q.defer();
		if ($auth.isAuthenticated()) {
			deferred.resolve();
		} else {
			$location.path('/login');
		}
		return deferred.promise;
	}];

	/* Textangular options, same options as StackOverflow */
	$provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$uibModal', function (taRegisterTool, taOptions, $uibModal) {
		taRegisterTool('uploadImage', {
			iconclass: "fa fa-paperclip",
			action: function (deferred, restoreSelection) {
				$uibModal.open({
					controller: 'UploadImageModalInstance',
					templateUrl: 'views/upload.html'
				}).result.then(
					function (result) {
						restoreSelection();
						document.execCommand('insertImage', true, result);
						deferred.resolve();
					},
					function () {
						deferred.resolve();
					}
				);
				return false;
			}
		});
		taOptions.toolbar =
			[
				['bold', 'italics'],
				['insertLink', 'quote', 'pre', 'insertImage'],
				['ol', 'ul'],
				['h1', 'h2'],
				['undo', 'redo'],
				['html']
			];
		taOptions.toolbar[1].push('uploadImage');
		return taOptions;
	}]);

	$urlRouterProvider.otherwise('/');
	$urlRouterProvider.when('/dashboard', '/dashboard/home');

	$stateProvider
	.state('intro', {
		url: '/',
		templateUrl: '/pages/intro.html',
		controller: 'introCtrl',
		controllerAs: 'intro'
	})
	.state('app', {
		url: '/dashboard',
		abstract: true,
		templateUrl: '/pages/dashboard.html',
	})
	.state('home', {
		url: '/home',
		templateUrl: '/pages/home.html',
		controller: 'homeCtrl',
		parent: "app",
		controllerAs: 'home'
	})
	.state('assignments', {
		url: '/assignments',
		templateUrl: '/pages/assignment.html',
		controller: 'assignmentCtrl',
		parent: "app",
		controllerAs: 'assignment'
	})
	.state('ask', {
		url: '/questions/ask',
		templateUrl: '/pages/ask.html',
		controller: 'askCtrl',
		parent: "app",
		controllerAs: 'askModel',
		resolve: {
			loginRequired: loginRequired
		}
	})
	.state('questions', {
		url: '/questions/:id',
		templateUrl: '/pages/question.html',
		parent: "app",
		controller: 'answerCtrl',
		controllerAs: 'answer',
		resolve: {
			/* Populating the question with the related answers */
			question: function ($stateParams, questionsService) {
				return questionsService.getById($stateParams.id);
			}
		}
	})
	.state('profile', {
		url: '/profile',
		templateUrl: '/pages/profile.html',
		controller: 'ProfileCtrl',
		resolve: {
			loginRequired: loginRequired
		}
	})
	.state('tags', {
		url: '/tags',
		parent: "app",
		templateUrl: '/pages/tags.html',
		controller: 'tagsCtrl',
		controllerAs: 'tagsModel'
	})
	.state('users', {
		url: '/users',
		templateUrl: '/pages/users.html',
		controller: 'usersCtrl',
		parent: "app",
		controllerAs: 'usersModel',
		resolve: {
			/* Getting all users */
			users: function (usersService) {
				return usersService.getUsers();
			}
		}
	})
	.state('login', {
		url: '/login',
		templateUrl: '/pages/login.html',
		controller: 'LoginCtrl',
		resolve: {
			skipIfLoggedIn: skipIfLoggedIn
		}
	})
	.state('signup', {
		url: '/signup',
		templateUrl: '/pages/signup.html',
		controller: 'SignupCtrl',
		resolve: {
			skipIfLoggedIn: skipIfLoggedIn
		}
	})
	.state('forgot', {
		url: '/forgot',
		templateUrl: '/pages/forgot.html',
		controller: 'ForgotCtrl',
		resolve: { skipIfLoggedIn: skipIfLoggedIn }
	})
	.state('reset', {
		url: '/reset/:token',
		templateUrl: '/pages/reset.html',
		controller: 'ResetCtrl',
		resolve: { skipIfLoggedIn: skipIfLoggedIn }
	})
	.state('content', {
		url: '/content',
		templateUrl: '/pages/video.html',
		controller: 'YoutubeCtrl',
		controllerAs:'controller'
	})
	.state('register', {
		url: '/register',
		templateUrl: '/pages/registration.html',
		controller: 'registrationCtrl',
		controllerAs:'registration'
	})
	.state('admin', {
		url: '/admin',
		templateUrl: '/pages/admin.html',
		controller: 'adminCtrl',
		controllerAs:'admin'
	})
	.state('logout', {
		url: '/logout',
		template: null,
		controller: 'LogoutCtrl',
		controllerAs: 'logout'
	});
	// use the HTML5 History API
	//$locationProvider.html5Mode({ enabled: true, requireBase: true, rewriteLinks: false });

})
.controller('UploadImageModalInstance', function ($scope, $uibModalInstance, Upload) {
	$scope.progress = 0;
	$scope.files = [];
	$scope.upload = function (file) {
		if (file) {
			Upload.upload({
				url: 'api/upload',
				data: {file: file}
			}).then(function (resp) {
				$scope.progress = 0;
				$scope.image = window.location.origin + "/api/resources/uuid?uuid=" + resp.data.uuid;
				console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
			}, function (resp) {
				console.log('Error status: ' + resp.status);
			}, function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				$scope.progress = progressPercentage;
				console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
			});
		}
	}

	$scope.insert = function () {
		$uibModalInstance.close($scope.image);
	};
})
.controller('sideNav', function($scope, $mdSidenav) {
	$scope.showMobileMainHeader = true;
	$scope.openSideNavPanel = function() {
		$mdSidenav('left').open();
	};
	$scope.closeSideNavPanel = function() {
		$mdSidenav('left').close();
	};
})