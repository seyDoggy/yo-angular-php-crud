'use strict';

/**
 * @ngdoc function
 * @name myWebAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myWebAppApp
 */
angular.module('myWebAppApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
