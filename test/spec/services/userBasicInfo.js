'use strict';

describe('Service: userBasicInfo', function () {

  // load the service's module
  beforeEach(module('angularUiTestingApp'));

  // instantiate service
  var userBasicInfo;
  beforeEach(inject(function(_userBasicInfo_) {
    userBasicInfo = _userBasicInfo_;
  }));

  it('should do something', function () {
    expect(!!userBasicInfo).toBe(true);
  });

});
