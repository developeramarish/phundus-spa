'use strict';

/**
 * @ngdoc function
 * @name phundusApp.directive:phOrganizationNavbar
 * @description
 * # phOrganizationNavbar
 */
angular.module('phundusApp')
  .directive('phOrganizationNavbar', ['Auth', function (Auth) {
    return {
      restrict: 'E',
      replace: 'true',
      scope: {
        organizationId: '=organizationId'
      },
      link: function ($scope) {
        $scope.accessLevels = Auth.accessLevels;
        $scope.userRoles = Auth.userRoles;
      },
      templateUrl: 'views/directives/ph-organization-navbar.html'
    }
  }]);