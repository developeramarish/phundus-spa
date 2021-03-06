(function () {
  'use strict';

  angular.module('ph.organizations')
    .controller('OrganizationsStoreCtrl', OrganizationsStoreCtrl);


  function OrganizationsStoreCtrl($scope, organizationId, Stores, Alert) {
    $scope.store = null;

    Stores.query({ownerId: organizationId}, function (res) {

      var store = res.results[0] || null;
      if (store && store.contact) {
        store.contact.postcode = parseInt(store.contact.postcode);
      }
      $scope.store = store;

      if (!$scope.store) {
        Alert.error('Die Materialstelle konnte nicht gefunden werden. Kontaktiere bitte das phundus-Team.');
      }
    }, function () {
      Alert.error('Fehler beim Laden der Materialstelle.');
    });
  }
})();
