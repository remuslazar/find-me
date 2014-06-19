'use strict';

/**
 * @ngdoc overview
 * @name findMeApp
 * @description
 * # findMeApp
 *
 * Main module of the application.
 */

angular
  .module('findMeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/:roomName?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
  });
