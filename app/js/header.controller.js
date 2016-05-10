'use strict'
angular.module('weatherModule').controller('headerController',
  ['$rootScope',
   '$scope',
   function($rootScope, $scope) {
    $rootScope.showMenu = {
      'state': false,
      'class': 'ng-hide'
    };

    $scope.show = function() {
      if(!!$rootScope.showMenu.state) {
        $rootScope.showMenu.class = 'animated slideOutUp';
      } else {
        $rootScope.showMenu.class = 'animated slideInDown';
      }
      $rootScope.showMenu.state = $rootScope.showMenu.state === false ? true: false;
    };
  }])
//})()
