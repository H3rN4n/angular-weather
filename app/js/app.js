(function(){

 'use strict'
  var weatherModule = angular.module('weatherModule', [])

  weatherModule.filter('kelvinToCelsius', function() {
    return function(input) {
      return input -273.15;
    };
  });

  weatherModule.factory('openWeatherService', function($http){
    var apiKey = 'af95bc4e30710dff7080cfb67eadba30'
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather'

    return {
    	getWeatherByCityName: function(cityName){
    		return $http({
            url: apiUrl,
            method: "GET",
            params: {'q': cityName, 'appid': apiKey}
         });
    	},
      getWeatherByCoords: function(coords){
    		return $http({
            url: apiUrl,
            method: "GET",
            params: {'lat': coords.lat, 'long': coords.long, 'appid': apiKey}
         });
    	}
    }
  })

  weatherModule.factory('placesFactory', function(openWeatherService){
    var places = []

    var isDuplicate = function(placeName){
      var result = places.filter(function(obj){
        return obj.name == placeName
      })
      if(!result.length){
        result = false
      } else {
        result = true
      }
      return result
    }

    return {
      getPlaces: function(){return places},
      removePlace: function(placeName){
        places = places.filter(function(obj){
           return obj.name != placeName
        })
        return this.getPlaces()
      },
      addPlace: function(placeName){
        if (placeName &&!isDuplicate(placeName)) {
          return openWeatherService.getWeatherByCityName(placeName)
           .then(function(response){
             places.push({
               "name": response.data.name,
               "coords": response.data.coord,
               "state": response.data.weather[0]['description'],
               "min": response.data.main.temp_min,
               "max": response.data.main.temp_max,
               'current': response.data.main.temp
             })
             return places;
           })
        }else if(!placeName){
          alert("Please insert a place")
          return places
        }else{
          alert("You can't add a duplicate place")
          return places
        }
      }
    }
  })

  weatherModule.controller('listController', function(placesFactory){
    var list = this
    var initialPlaces = ['Buenos Aires','Mendoza','Lima','San Francisco']

    for (var i = 0; i < initialPlaces.length; i++) {
      placesFactory.addPlace(initialPlaces[i])
    }

    list.places = placesFactory.getPlaces();
    list.addPlace = function(place){
      placesFactory.addPlace(place).then(function(response) {
        list.places = placesFactory.getPlaces();
      })
      list.newPlace = ""
    }

    list.removePlace = function(place){
      list.places = placesFactory.removePlace(place)
    }
  })
})()
