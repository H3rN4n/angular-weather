'use strict'
  angular.module('weatherModule').directive('weatherMenu', [function(){
    return {
      restrict: 'E',
      templateUrl: './menu.html'
    }
  }])