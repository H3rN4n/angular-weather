'use strict'
 angular.module('weatherModule').factory('panoramioService',['$http', function($http){

 	var apiUrl = 'http://www.panoramio.com/map/get_panoramas.php';
 	var radius = 0.15;
	 return {
	  getCityImage: function(coord) {
	   
	   return $http({
	             url: apiUrl,
	             method: 'JSONP',
	             params: {
	              'set': 'public',
	              'from': 0, 
	              'to': 1, 
	              'size': 'medium', 
	              'minx':coord.lon - radius,
	              'maxx':coord.lon + radius,
	              'miny':coord.lat - radius,
	              'maxy':coord.lat + radius,
	              'callback': 'JSON_CALLBACK'
	             }
	          });
	  }
 	}
  }])