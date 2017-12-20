/*global angular*/
'use strict';

angular
    .module('stack.service')
    .factory('userService', ['$q', '$http', '$stamplay', "$rootScope", 'Account',  function ($q, $http, $stamplay, $rootScope, Account) {

        var logged = false;
        var user;

        return {
            isLogged: function () {
                return logged;
            },
	        getUserModel: function () {
		        var def = $q.defer();

		        Account.getProfile()
		        .then(function(res) {
			        if (res.data.hasOwnProperty('_id')) {
				        //res.user.points = res.user.points || 0;
				        logged = true;
				        def.resolve(res.data);
			        } else {
				        logged = false;
				        def.resolve(false)
			        }

		        })
		        .catch(function (err) {
			        def.reject(err);
		        });


		        return def.promise;
	        }
        };
    }])

    .factory('usersService', ['$q', '$stamplay', '$http' ,function ($q, $stamplay, $http) {

        return {

            getUsers: function () {
                return $http({
                    method: 'GET',
                    url: '/api/getUsers'
                })
            },

            getById: function (userId) {
                var def = $q.defer();

                $stamplay.User.get({_id: userId})
                    .then(function (res) {
                        def.resolve(res.data[0]);
                    })
                    .catch(function (err) {
                        def.reject(err);
                    });


                return def.promise;
            },

            searchUser: function (params) {

                var def = $q.defer();

                $stamplay.User.get(params)
                    .then(function (res) {
                        def.resolve(res.data);
                    })
                    .catch(function (err) {
                        def.reject(err);
                    });

                return def.promise;
            }

        };
    }])