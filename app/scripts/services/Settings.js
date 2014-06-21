'use strict';

angular.module('findMeApp')
  .service('Settings', function Settings($rootScope, $localStorage, $routeParams) {
    
    // save the roomName from url for the redirect after login
    if ($routeParams.roomName) {
      $localStorage.roomName = $routeParams.roomName;
    }
    this.data = $localStorage;
    
    // if nickname undefined, create one on "GuestXX" the fly (user can change it later)
    if (!this.data.nickname) {
      this.data.nickname = 'User' + Math.floor((Math.random() * 100) + 1);
    }
    
    this.areValid = function() {
      return this.data.nickname && $routeParams.roomName;
    };
    
    function refresh() {
      if ($routeParams.roomName) {
	$localStorage.roomName = $routeParams.roomName;
      }
      $rootScope.title = '['+$localStorage.nickname+'] ' +
	'Find Me :: ' + $localStorage.roomName;
    }
    
    $rootScope.$on('$routeChangeSuccess', function () {
      refresh();
    });

    refresh();

  });
