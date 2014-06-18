'use strict';

angular.module('findMeApp')
  .controller('LoginCtrl', function ($scope, $cookieStore, $location, $routeParams) {
    $scope.nickname = $cookieStore.get('nickname');
    $scope.roomName = $routeParams.roomName || '';
    $scope.submit = function() {
      $cookieStore.put('nickname', $scope.nickname);
      $location.path('/'+ ($routeParams.roomName || $scope.roomName));
    };
  });
