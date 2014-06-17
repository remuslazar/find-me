'use strict';

describe('Service: Googlemap', function () {

  // load the service's module
  beforeEach(module('findMeApp'));

  // instantiate service
  var Googlemap;
  beforeEach(inject(function (_Googlemap_) {
    Googlemap = _Googlemap_;
  }));

  it('should do something', function () {
    expect(!!Googlemap).toBe(true);
  });

});
