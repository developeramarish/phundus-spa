'use strict';

angular.module('phundusApp')
  .directive('phShopSearch', ['Lessors', 'Alert',
    function (Lessors, Alert) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          submit: '='
        },
        templateUrl: 'views/directives/ph-shop-search.html',
        link: function (scope) {
          Lessors.get(function (res) {
            scope.lessors = res.results;
          }, function (res) {
            Alert.error('Fehler beim Laden der Vermieter: ' + res.data.message);
          });
        }
      }
    }
  ]);

angular.module('phundusApp')
  .directive('phShopItemImages', [
    function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          images: '='
        },
        templateUrl: 'views/directives/ph-shop-item-images.html',
        link: function (scope) {

          scope.$watch('images', function (images) {
            if (!images) {
              return;
            }
            var slides = scope.slides = [];
            var currIndex = 0;


            images.forEach(function (image) {
              slides.push({
                image: image.url,
                id: currIndex++
              });
            });
          });
        }
      }
    }]);

angular.module('phundusApp')
  .directive('phShopItemDocuments', [
    function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          documents: '='
        },
        templateUrl: 'views/directives/ph-shop-item-documents.html'
      }
    }]);

angular.module('phundusApp')
  .directive('phShopItemAvailability', ['_', 'moment', '$filter', 'ShopItemAvailability', 'Alert',
    function (_, moment, $filter, ShopItemAvailability, Alert) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          itemId: '='
        },
        templateUrl: 'views/directives/ph-shop-item-availability.html',
        link: function (scope) {

          var populateChartData = function (data) {

            var labels = _.map(data, function (each) {
              return $filter('date')(each.fromUtc, 'mediumDate');
            });
            labels.push($filter('date')(moment(data[data.length-1].fromUtc).add(1, 'months').calendar(), 'mediumDate'));

            var values = _.map(data, function (each) {
              return each.amount;
            });
            values.push(values[values.length-1]);

            var chartData = {
              labels: labels,
              datasets: [
                {
                  fillColor : "rgba(151,187,205,0.5)",
                  strokeColor : "rgba(151,187,205,1)",
                  pointColor : "rgba(151,187,205,1)",
                  pointStrokeColor : "#fff",
                  data : values
                }
              ]
            };

            scope.chart = {
              data: chartData
            };
          };

          ShopItemAvailability.get({itemId: scope.itemId}, function (res) {
            scope.availabilities = res.result;
            populateChartData(res.result);
          }, function (res) {
            Alert.error('Fehler beim Laden der Verfügbarkeit: ' + res.data.message);
          });
        }
      }
    }]);

angular.module('phundusApp')
  .directive('phShopItemAddToCart', ['_', '$filter', 'ShopItemsAvailabilityCheck', 'UsersCartItems', 'Alert', 'Auth', 'PriceCalculator', 'Shop',
    function (_, $filter, ShopItemsAvailabilityCheck, UsersCartItems, Alert, Auth, priceCalculatorFactory, Shop) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          item: '='
        },
        templateUrl: 'views/directives/ph-shop-item-add-to-cart.html',
        link: function (scope) {

          var priceCalculator = null;

          var formModel = scope.addToCartFormModel = {
            userId: Auth.user.userId,
            fromUtc: Shop.fromUtc,
            toUtc: Shop.toUtc,
            quantity: 1,
            isAvailable: false,
            availabilityChecking: false
          };

          scope.addToCartForm.$setPristine(false);
          scope.addToCartForm.$setDirty(true);

          scope.$watch('item', function (item) {
            if (!item) {
              return;
            }

            priceCalculator = priceCalculatorFactory(item.lessor.lessorId, item.publicPrice, item.memberPrice);
            formModel.itemId = formModel.articleId = item.itemId;
            formModel.pricePerWeek = $filter('number')(priceCalculator.getPrice(), 2);
            checkAvailability();
          });

          var checkAvailability = function () {

            if (formModel.itemId === undefined) {
              return;
            }

            formModel.availabilityChecking = true;
            var requestContent = _.pick(formModel, ['articleId', 'itemId', 'fromUtc', 'toUtc', 'quantity']);

            ShopItemsAvailabilityCheck.post(requestContent, function (res) {
              formModel.isAvailable = res.isAvailable;
              formModel.availabilityChecking = false;
            }, function (res) {
              formModel.isAvailable = false;
              formModel.availabilityChecking = false;
              Alert.error('Fehler beim Prüfen der Verfügbarkeit: ' + res.data.message);
            });

          };

          scope.checkAvailability = checkAvailability;

          scope.$watch('addToCartFormModel.fromUtc', checkAvailability);
          scope.$watch('addToCartFormModel.toUtc', checkAvailability);
          scope.$watch('addToCartFormModel.quantity', checkAvailability);

          scope.submit = function () {

            if (formModel.availabilityChecking || !formModel.isAvailable) {
              Alert.error('Das Material ist im gewählten Zeitraum mit dieser Menge nicht verfügbar.');
              return;
            }

            var requestContent = _.pick(formModel, ['fromUtc', 'toUtc', 'quantity']);
            requestContent.articleGuid = formModel.itemId;
            requestContent.userId = Auth.user.userId;

            UsersCartItems.post(requestContent, function () {
              Shop.fromUtc = requestContent.fromUtc;
              Shop.toUtc = requestContent.toUtc;
              Alert.success('Der Artikel wurde erfolgreich dem Warenkorb hinzugefügt.');
            }, function (res) {
              Alert.error('Fehler beim Hinzufügen des Artikels in den Warenkorb: ' + res.data.message);
            })
          };

          scope.total = function () {
            if (!priceCalculator) {
              return;
            }
            return priceCalculator.getTotal(formModel.fromUtc, formModel.toUtc, formModel.quantity, true);
          };
        }
      }
    }
  ]);
