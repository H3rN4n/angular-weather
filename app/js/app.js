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
    var apiUrl = 'http://api.openweathermap.org/data/2.5/'

    return {
    	getCurrentWeatherByCityName: function(cityName){
    		return $http({
            url: apiUrl + "weather",
            method: "GET",
            params: {'q': cityName, 'appid': apiKey, 'units': 'metric'}
         });
    	},
      getForecastWeatherByCityName: function(cityName){
    		return $http({
            url: apiUrl + 'forecast/daily',
            method: "GET",
            params: {'q': cityName, 'appid': apiKey, 'units': 'metric', 'cnt': 6}
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
          return openWeatherService.getForecastWeatherByCityName(placeName)
           .then(function(response){
             var forecast = response
             return openWeatherService.getCurrentWeatherByCityName(placeName)
              .then(function(response){
                var currentWeather = response
                places.push({
                  "name": forecast.data.city.name,
                  "coords": forecast.data.city.coord,
                  "state": forecast.data.list[0]['weather'][0]['description'],
                  "min": forecast.data.list[0]['temp']['min'],
                  "max": forecast.data.list[0]['temp']['max'],
                  'current': currentWeather.data.main.temp,
                  'forecast': forecast.data.list
                })
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
      list.places = placesFactory.getPlaces()
    }

    list.addPlace = function(place){
      placesFactory.addPlace(place).then(function(response) {
        list.places = placesFactory.getPlaces()
      })
      list.newPlace = ""
    }

    list.removePlace = function(place){
      list.places = placesFactory.removePlace(place)
    }
  })
})()
