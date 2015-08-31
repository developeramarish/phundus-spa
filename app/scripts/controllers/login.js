'use strict';

/**
 * @ngdoc function
 * @name phundusApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the phundusApp
 */
angular.module('phundusApp')
  .controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth',
    function ($rootScope, $scope, $location, $window, Auth) {

      $rootScope.error = '';
      $rootScope.warn = '';

      $scope.rememberMe = true;
      $scope.login = function () {

        Auth.login({
            username: $scope.username,
            password: $scope.password,
            rememberme: $scope.rememberMe
          },
          function () {
            var returnUrl = $location.search().ReturnUrl;
            if (returnUrl) {
              $window.location.href = returnUrl;
            }
            else {
              var returnPath = $location.search().returnPath || '/debug';
              delete $location.search().returnPath;
              $location.path(returnPath);
            }
          },
          function () {
            $rootScope.error = "Failed to login.";
          });
      };
    }]);
