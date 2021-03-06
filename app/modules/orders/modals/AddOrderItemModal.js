(function () {
  'use strict';

  angular.module('ph.orders')
    .factory('OrdersAddOrderItemModal', AddOrderItemModal);


  function AddOrderItemModal($uibModal) {
    return {
      open: openModal
    };

    function openModal(resolve) {
      var modal = $uibModal.open({
        templateUrl: 'modules/orders/views/modals/add-order-item.html',
        controller: AddOrderItemModalInstCtrl,
        resolve: resolve
      });

      return modal.result;
    }
  }

  /*@ngInject*/
  function AddOrderItemModalInstCtrl($scope, $uibModalInstance, lessorId, orderId, item, $http, priceCalculatorFactory) {
    var priceCalculator = {
      getPrice: function () {
        return 0;
      },
      getTotal: function () {
        return 0;
      }
    };

    var calculateLineTotal = function () {
      $scope.unitPrice = priceCalculator.getPrice();
      $scope.lineTotal = priceCalculator.getTotal($scope.fromUtc, $scope.toUtc, $scope.quantity, true);
    };

    if (item) {
      $scope.fromUtc = item.fromUtc;
      $scope.toUtc = item.toUtc;
      $scope.quantity = item.quantity;
      $scope.unitPrice = item.unitPrice;
      $scope.lineTotal = item.lineTotal;
    }
    else {
      $scope.fromUtc = new Date();
      $scope.toUtc = new Date();
      $scope.quantity = 1;
      $scope.unitPrice = 0;
      $scope.lineTotal = 0;
    }

    $scope.getArticles = function (val) {
      return $http.get('/api/v0/articles', {
        params: {
          ownerId: lessorId,
          q: val
        }
      }).then(function (response) {

        return response.data.results;
      });
    };

    $scope.ok = function () {
      if (!$scope.addItemForm.$valid) {
        return;
      }
      $uibModalInstance.close({
        lessorId: lessorId,
        orderId: orderId,
        articleId: $scope.selected.articleId,
        articleShortId: $scope.selected.articleShortId,
        text: $scope.selected.name,
        fromUtc: $scope.fromUtc,
        toUtc: $scope.toUtc,
        quantity: $scope.quantity,
        unitPrice: $scope.unitPrice,
        lineTotal: $scope.lineTotal
      });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.$watch('selected', function (article) {
      if (!article) {
        return;
      }
      priceCalculator = priceCalculatorFactory(lessorId, article.publicPrice, article.memberPrice);
      calculateLineTotal();
    });

    $scope.$watch('fromUtc', function (fromUtc) {
      if (!fromUtc) {
        return;
      }
      calculateLineTotal();
    });

    $scope.$watch('toUtc', function (toUtc) {
      if (!toUtc) {
        return;
      }
      calculateLineTotal();
    });

    $scope.$watch('quantity', function (quantity) {
      if (!quantity) {
        return;
      }
      calculateLineTotal();
    });
  }
})();
