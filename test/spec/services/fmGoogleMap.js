'use strict';

describe('Service: Fmgooglemap', function () {

  // load the service's module
  beforeEach(module('findMeApp'));

  // instantiate service
  var Fmgooglemap;
  beforeEach(inject(function (_Fmgooglemap_) {
    Fmgooglemap = _Fmgooglemap_;
  }));

  it('should do something', function () {
    expect(!!Fmgooglemap).toBe(true);
  });

});
