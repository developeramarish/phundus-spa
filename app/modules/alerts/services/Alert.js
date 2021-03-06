(function () {
  'use strict';

  angular.module('ph.alerts')
    .factory('Alert', alert);


  function alert(_, AlertModal) {
    var modal = null;

    return {
      danger: _.partial(showAlert, 'danger'),
      error: _.partial(showAlert, 'danger'),
      info: _.partial(showAlert, 'info'),
      success: _.partial(showAlert, 'success'),
      warning: _.partial(showAlert, 'warning')
    };

    function showAlert(type, msg, title) {
      if (modal === null) {
        modal = AlertModal.open({
          alert: function () {
            return {
              type: type,
              msg: msg,
              title: title
            };
          }
        });
        modal.then(function () {
          modal = null;
        }, function () {
          modal = null;
        });
      }
    }
  }
})();
