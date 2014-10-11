'use strict';

/**
 * @ngdoc function
 * @name myWebAppApp.controller:CarsCtrl
 * @description
 * # CarsCtrl
 * Controller of the myWebAppApp
 */
angular.module('myWebAppApp')
  .controller('CarsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
