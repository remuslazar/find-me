'use strict';

/**
 * @ngdoc overview
 * @name findMeApp
 * @description
 * # findMeApp
 *
 * Main module of the application.
 */

/*global Firebase */

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
  .factory('PlacesDatastore', function($firebase) {
    var datastore = {};
    var ref = new Firebase('https://find-me.firebaseio.com/places');
    datastore.places = $firebase(ref);
    return datastore;
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
