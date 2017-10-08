/*global angular*/
'use strict';

angular.module('stack', ['stack.service', 'infinite-scroll', 'ngRoute', 'ui.router', 'ui.bootstrap', 'textAngular', 'ngStamplay', 'socialLogin']);

angular
    .module('stack')
    .config(function ($stateProvider, $urlRouterProvider, $provide, socialProvider) {
        socialProvider.setFbKey({appId: '1459189657469557', apiVersion: "v2.4"});

        /* Textangular options, same options as StackOverflow */
        $provide.decorator('taOptions', ['$delegate',
            function (taOptions) {
                taOptions.toolbar =
                    [
                        ['bold', 'italics'],
                        ['insertLink', 'quote', 'pre', 'insertImage'],
                        ['ol', 'ul'],
                        ['h1', 'h2'],
                        ['undo', 'redo'],
                        ['html']
                    ];
                return taOptions;
            }
        ]);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/pages/home.html',
                controller: 'homeCtrl',
                controllerAs: 'home'
            })
            .state('ask', {
                url: '/questions/ask',
                templateUrl: '/pages/ask.html',
                controller: 'askCtrl',
                controllerAs: 'askModel'
            })
            .state('questions', {
                url: '/questions/:id',
                templateUrl: '/pages/question.html',
                controller: 'answerCtrl',
                controllerAs: 'answer',
                resolve: {
                    /* Populating the question with the related answers */
                    question: function ($stateParams, questionsService) {
                        return questionsService.getById($stateParams.id);
                    }
                }
            })
            .state('tags', {
                url: '/tags',
                templateUrl: '/pages/tags.html',
                controller: 'tagsCtrl',
                controllerAs: 'tagsModel'
            })
            .state('users', {
                url: '/users',
                templateUrl: '/pages/users.html',
                controller: 'usersCtrl',
                controllerAs: 'usersModel',
                resolve: {
                    /* Getting all users */
                    users: function (usersService) {
                        return usersService.getUsers();
                    }
                }
            });
    })
    /*
        Before starting the application we're saving the user if present in the rootScope
    */
    .controller('mainController', function ($scope,$rootScope,userService) {
        $rootScope.$on('event:social-sign-in-success', function (event, userDetails) {

            var element = angular.element('#closeLogin');
            element.click()

            var user = {
                displayName: userDetails.name,
                profileImg: userDetails.imageUrl,
                provider: userDetails.provider,
                uuid: userDetails.uid,
            };
            $scope.user = user;
            userService.setUserModal(user)
                .then(function (response) {
                    $scope.user = response.data.data;
                    $rootScope.user = $scope.user;
                })
        });

        $scope.showLogin = function (size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'login.html',
                size: size,
                appendTo: parentElem,
            });
            modalInstance.result.then(function (selectedItem) {
                //$ctrl.selected = selectedItem;
                console.log("User")
            }, function () {
                console.log("Dismissed");
            });
        }
    });