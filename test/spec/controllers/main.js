'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('findMeApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a placeFilter function to the scope', function () {
    expect(scope.placeFilter({cords: true})).toBe(true);
  });
});
