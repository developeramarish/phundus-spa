'use strict';

angular.module('phundusApp')
  .factory('Auth', function ($http, $cookieStore) {

    var accessLevels = window.routingConfig.accessLevels
      , userRoles = window.routingConfig.userRoles
      , currentUser = $cookieStore.get('user') || {username: '', role: userRoles.public};

    $cookieStore.remove('user');

    function changeUser(user) {
      angular.extend(currentUser, user);
    }

    return {
      authorize: function (accessLevel, role) {
        if (role === undefined) {
          role = currentUser.role;
        }

        return accessLevel.bitMask & role.bitMask;
      },
      isLoggedIn: function (user) {
        if (user === undefined) {
          user = currentUser;
        }
        return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
      },
      register: function (user, success, error) {
        $http.post('/api/v1/register', user).success(function (res) {
          changeUser(res);
          success();
        }).error(error);
      },
      login: function (user, success, error, warn) {
        $http.post('/api/v1/login', user).success(function (user) {
          $http.post('/api/v0/login', user).success(function () {
            changeUser(user);
            success(user);
          }).error(function (err) {
            changeUser(user);
            warn(err);
          });
        }).error(error);
      },
      logout: function (success, error, warn) {
        $http.post('/api/v1/logout').success(function () {
          $http.post('/api/v0/logout').success(function () {
            changeUser({
              username: '',
              role: userRoles.public
            });
            success();
          }).error(function (err) {
            changeUser({
              username: '',
              role: userRoles.public
            });
            warn(err);
          });
        }).error(error);
      },
      accessLevels: accessLevels,
      userRoles: userRoles,
      user: currentUser
    };
  });

angular.module('phundusApp')
  .factory('Users', function ($http) {
    return {
      getAll: function (success, error) {
        $http.get('/api/v1/users').success(success).error(error);
      }
    };
  });
