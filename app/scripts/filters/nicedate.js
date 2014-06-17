'use strict';

/**
 * @ngdoc filter
 * @name findMeApp.filter:niceDate
 * @function
 * @description
 * # niceDate
 * Filter in the findMeApp.
 */
angular.module('findMeApp')
  .filter('niceDate', function ($filter) {
    function isToday(date) {
      return $filter('date')(date, 'shortDate') ===
	$filter('date')(new Date(), 'shortDate');
    }
    return function (date) {
      return isToday(date) ? $filter('date')(date, 'shortTime') :
      $filter('date')(date, 'short');
    };
  });
