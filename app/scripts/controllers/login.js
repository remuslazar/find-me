'use strict';

angular.module('findMeApp')
  .controller('LoginCtrl', function ($scope, $cookieStore, $location) {
    $scope.submit = function() {
      $cookieStore.put('nickname', $scope.nickname);
      $location.path('/');
    };
  });
