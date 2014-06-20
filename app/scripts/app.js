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
    'ngCookies',
    'ngStorage',
    'ngAnimate',
    'ngRoute',
    'ngTouch',
    'firebase',
  ])
  .constant('FIREBASE_URL', 'https://find-me.firebaseio.com/')
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
      })
      .otherwise({
	redirectTo: '/login'
      });
  });
