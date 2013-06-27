'use strict';

describe('Controller: UserIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('angularUiTestingApp'));

  var UserIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserIndexCtrl = $controller('UserIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
