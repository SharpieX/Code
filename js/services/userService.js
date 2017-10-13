/*global angular*/
'use strict';

angular
    .module('stack.service')
    .factory('userService', ['$q', '$http', '$stamplay', "$rootScope", function ($q, $http, $stamplay, $rootScope) {

        var logged = false;
        var user;

        return {
            isLogged: function () {
                return logged;
            },
            setUserModal: function (val) {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: '/api/authUser/id',
                    params: {id: val.uuid}
                }).then(function (response) {
                    if (!response.data.err) {
                        logged = true;
                        user = response.data.data;
                        def.resolve(response);
                    } else if (response.data.err === 2) {
                        $http({
                            method: 'POST',
                            url: '/api/saveUser',
                            data: val,
                        }).then(function (response) {
                            if (!response.err) {
                                logged = true;
                                user = response.data.data;
                                def.resolve(response);
                            }
                        })
                    }
                }).catch(function (err) {
                        def.reject(err);
                    });

                return def.promise;


            },
            getUserModel: function () {
                return user;
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