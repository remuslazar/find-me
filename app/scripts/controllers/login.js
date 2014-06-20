'use strict';

angular.module('findMeApp')
  .controller('LoginCtrl', function ($scope, Settings, $location) {
    $scope.nickname = Settings.nickname;
    $scope.roomName = Settings.roomName;

    $scope.submit = function() {
      Settings.setNickname($scope.nickname);
      Settings.setRoomName($scope.roomName);
      $location.path('/'+ Settings.roomName).replace();
    };
  });
