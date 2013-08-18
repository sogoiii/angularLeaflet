'use strict';

describe('Service: leafletPins', function () {

  // load the service's module
  beforeEach(module('angularUiTestingApp'));

  // instantiate service
  var leafletPins;
  beforeEach(inject(function(_leafletPins_) {
    leafletPins = _leafletPins_;
  }));

  it('should do something', function () {
    expect(!!leafletPins).toBe(true);
  });

});
