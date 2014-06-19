'use strict';

describe('Filter: niceDate', function ($filter) {

  // load the filter's module
  beforeEach(module('findMeApp'));

  // initialize a new instance of the filter before each test
  var niceDate;
  beforeEach(inject(function ($filter) {
    niceDate = $filter('niceDate');
  }));

  it('should return time if the date is ', function () {
    var text = 'angularjs';
    var date = new Date();
    expect(niceDate(date)).toBe($filter('date')(date, 'shortTime'));
  });

});
