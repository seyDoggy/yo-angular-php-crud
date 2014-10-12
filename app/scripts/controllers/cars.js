'use strict';

/**
 * @ngdoc function
 * @name myWebAppApp.controller:CarsCtrl
 * @description
 * # CarsCtrl
 * Controller of the myWebAppApp
 */
angular.module('myWebAppApp')
  .controller('CarsCtrl', function ($scope, Restangular) {
      var url = 'cars';
      var Cars = Restangular.all(url);
      var blankCar = {
          make:"",
          model:"",
          pkg:"",
          year:""
      };
      var refreshCars = function() {
          $scope.isEditVisible = false;
          $scope.isAddNewCar = false;
          Cars.getList().then(function(data) {
              console.log('--> api/cars called from refreshCars()');
              $scope.cars = data;
          });
      };

      $scope.showAdd = function () {
          if ($scope.isEditVisible === false) {
              $scope.isAddNewCar = true;
          }
      };

      $scope.hideAdd = function () {
          $scope.isAddNewCar = false;
          $scope.newCar = angular.copy($scope.blankCar);
      };

      $scope.showEdit = function (idx) {
          $scope.isEditVisible = idx;
          $scope.newCar = angular.copy(blankCar);
      };

      $scope.saveCar = function() {
          $scope.isEditVisible = false;
          $scope.isAddNewCar = false;
          Cars.post($scope.newCar).then(function (data) {
              $scope.cars.push(data);
              console.log('--> newCar saved!');
          },
          function () {
              console.log('--> Could not save newCar!');
          });
      };

      $scope.updateCar = function(idx) {
          $scope.isAddNewCar = false;
          Cars.getList().then(function(data) {
              console.log('--> api/cars called from updateCar()');
              $scope.cars = data;
              var carWithId = _.find($scope.cars, function(car) {
                  return car.id === $scope.cars[idx].id;
              });

              carWithId.make = $scope.newCar.make || carWithId.make;
              carWithId.model = $scope.newCar.model || carWithId.model;
              carWithId.pkg = $scope.newCar.pkg || carWithId.pkg;
              carWithId.year = $scope.newCar.year || carWithId.year;
              carWithId.put();
              $scope.isEditVisible = false;
          });
      };

      $scope.deleteCar = function(idx) {
          var car = Restangular.one(url, $scope.cars[idx].id);
          car.remove();
          $scope.cars.splice(idx, 1);
      };

      refreshCars();
  });
