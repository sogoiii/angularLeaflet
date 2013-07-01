'use strict';

angular.module('angularUiTestingApp')
  .factory('userBasicInfo', ['$rootScope', function($rootScope){

    var userBasicInfo = {};
    userBasicInfo.userName = '';
    userBasicInfo.userType = '';
    userBasicInfo._id = '';
    userBasicInfo.prepForBroadcast = function(userInfo){
      // console.log('userBasicInfo service === ' + userInfo._id)
      this.userName = userInfo.firstName + ' ' + userInfo.lastName;
      this.userType = userInfo.userType;
      this._id = userInfo._id;
      this.broadcastItem();
    }
    userBasicInfo.broadcastItem = function() {
        $rootScope.$broadcast('userBasicInfoBroadcast');
    };
    return userBasicInfo;
  }]);
