'use strict';

angular.module('findMeApp')
  .controller('LoginCtrl', function ($scope, Settings, $location) {
    $scope.nickname = Settings.data.nickname;
    $scope.roomName = Settings.data.roomName;

    $scope.submit = function() {
      Settings.data.nickname = $scope.nickname;
      Settings.data.roomName = $scope.roomName;
      $location.path('/'+ Settings.data.roomName).replace();
    };
  });
