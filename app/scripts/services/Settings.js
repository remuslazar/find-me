'use strict';

angular.module('findMeApp')
  .service('Settings', function Settings($rootScope, $cookieStore, $routeParams) {
    this.nickname = $cookieStore.get('nickname');
    this.setNickname = function(newNickname) {
      this.nickname = newNickname;
      $cookieStore.put('nickname', newNickname);      
    };
    
    this.setRoomName = function(name) {
      this.roomName = name;
      $cookieStore.put('roomName', name);
    };
    
    this.areValid = function() {
      return $routeParams.roomName && this.nickname && this.roomName;
    };
    
    if ($routeParams.roomName) {
      this.setRoomName($routeParams.roomName);
    } else {
      this.roomName = $cookieStore.get('roomName');
    }    
    $rootScope.title = '['+this.nickname+'] ' + 'Find Me :: ' + this.roomName;
  });
