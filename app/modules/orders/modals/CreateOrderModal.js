(function () {
  'use strict';

  angular.module('ph.orders')
    .factory('OrdersCreateOrderModal', CreateOrderModal);


  function CreateOrderModal($uibModal) {
    return {
      open: openModal
    };

    function openModal(resolve) {
      var modal = $uibModal.open({
        templateUrl: 'modules/orders/views/modals/create-order.html',
        controller: CreateOrderModalInstCtrl,
        resolve: resolve
      });

      return modal.result;
    }
  }

  /*@ngInject*/
  function CreateOrderModalInstCtrl($scope, $uibModalInstance, lessorId, $http) {

    $scope.getMembers = function (val) {
      return $http.get('/api/v0/organizations/' + lessorId + '/members', {
        params: {
          username: val
        }
      }).then(function (response) {

        return response.data.results.map(function (item) {
          return item;
        });
      });
    };

    $scope.ok = function () {
      $uibModalInstance.close($scope.selected);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
