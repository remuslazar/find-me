'use strict';

/**
 * @ngdoc filter
 * @name findMeApp.filter:niceDistance
 * @function
 * @description
 * # niceDistance
 * Filter in the findMeApp.
 */
angular.module('findMeApp')
  .filter('niceDistance', function ($filter) {
    return function (input) {
      return input < 1000 ? $filter('number')(input, 0) + 'm' :
	$filter('number')(input/1000, 1) + 'km';
    };
  });
