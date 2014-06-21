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
    
    // get the difference in Seconds from the given date to the current time
    function timeDiff(date) {
      var now = new Date();
      var d = new Date(date);
      return (now.getTime() - d.getTime()) / 1000;
    }

    function timeSpan(seconds) {
      return seconds < 15 ? 'now' :
	seconds < 60 ? Math.round(seconds) + ' sec' :
	Math.round(seconds/60) + ' min';
    }

    function isToday(date) {
      return $filter('date')(date, 'shortDate') ===
	$filter('date')(new Date(), 'shortDate');
    }

    return function (date) {
      var diff = timeDiff(date); // difference from date to now in seconds
      return diff < 3600 ? // date in the past hour?
      timeSpan(diff) : // else
      isToday(date) ? $filter('date')(date, 'shortTime') :
	$filter('date')(date, 'short');
    };
  });
