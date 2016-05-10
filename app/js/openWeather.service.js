'use strict'
 angular.module('weatherModule').factory('openWeatherService',['$http', function($http){
    var apiKey = 'af95bc4e30710dff7080cfb67eadba30'
    var apiUrl = 'http://api.openweathermap.org/data/2.5/'

    return {
    	getCurrentWeatherByCityName: function(cityName, units){
    		return $http({
            url: apiUrl + "weather",
            method: "GET",
            params: {'q': cityName, 'appid': apiKey, 'units': units || 'metric'}
         });
    	},
      getForecastWeatherByCityName: function(cityName, units){
    		return $http({
            url: apiUrl + 'forecast/daily',
            method: "GET",
            params: {'q': cityName, 'appid': apiKey, 'units': units || 'metric', 'cnt': 6}
         });
    	},
      getForecastWeatherByCoords: function(coords, units){
    		return $http({
            url: apiUrl + 'forecast/daily',
            method: "GET",
            params: {'lat': coords.lat, 'lon': coords.long, 'appid': apiKey, 'units': units || 'metric', 'cnt': 6}
         });
    	},
      getWeatherByCoords: function(coords, units){
    		return $http({
            url: apiUrl + "find",
            method: "GET",
            params: {'lat': coords.lat, 'lon': coords.long, 'appid': apiKey, 'units': units || 'metric', 'cnt': 2}
         });
    	}
    }
  }])