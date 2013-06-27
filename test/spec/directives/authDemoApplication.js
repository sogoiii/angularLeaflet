'use strict';

describe('Directive: authDemoApplication', function () {
  beforeEach(module('angularUiTestingApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<auth-demo-application></auth-demo-application>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the authDemoApplication directive');
  }));
});
