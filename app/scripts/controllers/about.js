'use strict';

/**
 * @ngdoc function
 * @name myWebAppApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the myWebAppApp
 */
angular.module('myWebAppApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
