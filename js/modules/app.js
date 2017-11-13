/*global angular*/
'use strict';

angular.module('stack', ['stack.service', 'infinite-scroll', 'ngRoute', 'ui.router', 'ui.bootstrap', 'textAngular', 'ngStamplay', 'socialLogin','ngFileUpload']);

angular
    .module('stack')
    .config(function ($stateProvider, $urlRouterProvider, $provide, socialProvider, $locationProvider) {
        socialProvider.setFbKey({appId: '1459189657469557', apiVersion: "v2.4"});

        /* Textangular options, same options as StackOverflow */
        $provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$uibModal', function (taRegisterTool, taOptions, $uibModal) {
            taRegisterTool('uploadImage', {
                iconclass: "fa fa-paperclip",
                action: function (deferred,restoreSelection) {
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
        // use the HTML5 History API
       //$locationProvider.html5Mode(true);
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
                email:userDetails.email,
            };
            $scope.user = user;
            userService.setUserModal(user)
                .then(function (response) {
                    $scope.user = response.data.data;
                    $rootScope.user = $scope.user;
                })
        });

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