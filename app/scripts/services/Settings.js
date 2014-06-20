'use strict';

angular.module('findMeApp')
  .service('Settings', function Settings($rootScope, $localStorage, $routeParams) {
    this.data = $localStorage;

    this.areValid = function() {
      return $routeParams.roomName && $localStorage.nickname && $localStorage.roomName;
    };

    $rootScope.$on('$routeChangeSuccess', function () {
      if ($routeParams.roomName) {
	$localStorage.roomName = $routeParams.roomName;
      }
      $rootScope.title = '['+$localStorage.nickname+'] ' +
	'Find Me :: ' + $localStorage.roomName;
    });
  });
