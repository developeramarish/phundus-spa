'use strict';

angular.module('phundusApp')

  .config(['$resourceProvider', function ($resourceProvider) {
    angular.extend($resourceProvider.defaults.actions, {
      patch: {
        method: 'PATCH'
      },
      post: {
        method: 'POST'
      },
      query: {
        method: 'GET',
        isArray: false
      }
    });
  }])

  .factory('AccountChangeEmailAddress', ['$resource', function ($resource) {
    return $resource('/api/account/change-email-address');
  }])
  .factory('AccountChangePassword', ['$resource', function ($resource) {
    return $resource('/api/account/change-password');
  }])
  .factory('AccountResetPassword', ['$resource', function ($resource) {
    return $resource('/api/account/reset-password');
  }])

  .factory('AdminOrganizations', ['$resource', function ($resource) {
    return $resource('/api/v0/admin/organizations/:organizationId', {organizationId: '@organizationId'});
  }])
  .factory('AdminUsers', ['$resource', function ($resource) {
    return $resource('/api/v0/admin/users/:userId', {userId: '@userId'});
  }])
  .factory('Applications', ['$resource', function ($resource) {
    return $resource(
      '/api/v0/organizations/:organizationId/applications/:applicationId', {
        organizationId: '@organizationId',
        applicationId: '@id'
      }, {
        query: {
          method: 'GET',
          isArray: true
        }
      }
    );
  }])
  .factory('Articles', ['$resource', function ($resource) {
    return $resource('/api/v0/articles/:articleId', {articleId: '@articleId'});
  }])
  .factory('ArticlesStock', ['$resource', function ($resource) {
    return $resource('/api/v0/articles/:articleId/stock', {articleId: '@articleId'});
  }])
  .factory('Contracts', ['$resource', function ($resource) {
    return $resource('/api/v0/contracts/:contractId', {contractId: '@contractId'});
  }])
  .factory('ContractItems', ['$resource', function ($resource) {
    return $resource('/api/v0/contracts/:contractId/items/:contractItemId', {
      contractId: '@contractId',
      contractItemId: '@contractItemId'
    });
  }])
  .factory('EventLog', ['$resource', function ($resource) {
    return $resource('/api/v0/event-log', {}, {query: {method: 'GET', isArray: true}});
  }])
  .factory('Feedback', ['$resource', function ($resource) {
    return $resource('/api/v0/feedback');
  }])
  .factory('Mails', ['$resource', function ($resource) {
    return $resource('/api/v0/mails/:mailId', {mailId: '@mailId'});
  }])
  .factory('Members', ['$resource', function ($resource) {
    return $resource('/api/v0/organizations/:organizationId/members/:memberId', {
        organizationId: '@organizationId',
        memberId: '@id'
      }, {
        query: {
          method: 'GET',
          isArray: true
        }
      }
    );
  }])
  .factory('Orders', ['$resource', function ($resource) {
    return $resource('/api/v0/orders/:orderId', {orderId: '@orderId'});
  }])
  .factory('OrderItems', ['$resource', function ($resource) {
    return $resource('/api/v0/orders/:orderId/items/:orderItemId', {orderId: '@orderId', orderItemId: '@orderItemId'});
  }])
  .factory('Stores', ['$resource', function ($resource) {
    return $resource('/api/v0/stores/:storeId', {storeId: '@storeId'});
  }])
  .factory('Users', ['$resource', function ($resource) {
    return $resource('/api/v0/users/:userId', {userId: '@userId'});
  }])
  .factory('Organizations', ['$resource', function ($resource) {
    return $resource('/api/v0/organizations/:organizationId', {organizationId: '@organizationId'});
  }])

  .factory('Relationships', ['$http', function ($http) {
    return {
      get: function (organizationId, success, error) {
        $http.get('/api/v0/organizations/' + organizationId + '/relationships').success(success).error(error);
      }
    }
  }])
  .factory('SchemaUpdate', ['$resource', function ($resource) {
    return $resource('/api/schema-update');
  }])
;
