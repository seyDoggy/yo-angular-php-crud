'use strict';

/**
 * @ngdoc overview
 * @name myWebAppApp
 * @description
 * # myWebAppApp
 *
 * Main module of the application.
 */
angular
  .module('myWebAppApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/cars', {
        templateUrl: 'views/cars.html',
        controller: 'CarsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function (RestangularProvider) {
      RestangularProvider.setBaseUrl('/api/');
  });
