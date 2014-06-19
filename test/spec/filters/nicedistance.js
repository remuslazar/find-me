'use strict';

describe('Filter: niceDistance', function () {

  // load the filter's module
  beforeEach(module('findMeApp'));

  // initialize a new instance of the filter before each test
  var niceDistance;
  beforeEach(inject(function ($filter) {
    niceDistance = $filter('niceDistance');
  }));

  it('should return the input prefixed with "niceDistance filter:"', function () {
    var text = 'angularjs';
    expect(niceDistance(text)).toBe('niceDistance filter: ' + text);
  });

});
