'use strict';

/**
 * @ngdoc function
 * @name findMeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the findMeApp
 */
angular.module('findMeApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
