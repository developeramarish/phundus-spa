(function () {
  'use strict';

  angular.module('ph.account')
    .factory('AccountChangeEmailAddressModal', ['$uibModal', changeEmailAddressModal]);


  function changeEmailAddressModal(uibModal) {
    return {
      open: openModal
    };

    function openModal() {
      uibModal.open({
        templateUrl: 'modules/account/views/modals/change-email-address.html',
        controller: ChangeEmailAddressModalInstCtrl
      });
    }
  }

  /*@ngInject*/
  function ChangeEmailAddressModalInstCtrl($scope, $uibModalInstance, $timeout, AccountChangeEmailAddress) {
    $scope.ok = ok;
    $scope.cancel = cancel;

    function ok() {
      if (!$scope.formChangeEmailAddress.$valid) {
        return;
      }

      $scope.success = null;
      $scope.error = null;

      $scope.formChangeEmailAddress.$submitting = true;
      AccountChangeEmailAddress.post($scope.changeEmailAddress, function () {
        $scope.formChangeEmailAddress.$submitting = false;
        if ($scope.formChangeEmailAddress) {
          $scope.formChangeEmailAddress.$setPristine();
          $scope.formChangeEmailAddress.$setUntouched();
        }
        $scope.changeEmailAddress = {};
        $scope.success = 'Das Bestätigungs-E-Mail wurde versendet.';
        $timeout(function () {
          $uibModalInstance.close();
        }, 2000);
      }, function () {
        $scope.formChangeEmailAddress.$submitting = false;
        $scope.error = 'Fehler beim Ändern der E-Mail-Addresse.';
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
